import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { postZod } from "../../../validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelectGroup } from "../../../store/communities";
import { useCreatePost } from "../../../api/posts";
import { useAuth } from "../../../providers/AuthProvider";
import { Toast } from "react-native-toast-notifications";
import { useQueryClient } from "@tanstack/react-query";
export default function Create() {
  const { control, formState, handleSubmit, reset } = useForm<postZod>({
    defaultValues: {
      description: "",
      title: "",
      image: "",
    },
    resolver: zodResolver(postZod),
  });
  const { group, setGroup } = useSelectGroup();
  const { user } = useAuth();
  const user_id = user?.id;
  if (!user_id) return <Text> Login in first</Text>;

  const { mutate, isPending } = useCreatePost();
  const queryClient = useQueryClient();

  const goBack = () => {
    router.back();
    reset();
    setGroup(null);
  };

  const onSubmit = (data: postZod) => {
    if (!group?.id) {
      Toast.show("Please select a group first", { type: "error" });
      return;
    }

    mutate(
      {
        group_id: group.id,
        title: data.title,
        user_id,
        description: data.description,
      },
      {
        onSuccess: (data) => {
          Toast.show("Post Added Successfully", { type: "success" });
          reset();

          queryClient.invalidateQueries({ queryKey: ["posts"] });
          goBack();
        },
        onError: (err) => {
          Toast.show("Failed to create post" + err);
        },
      }
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1, padding: 20 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <AntDesign name="close" size={30} color={"black"} onPress={goBack} />
        <Pressable onPress={handleSubmit(onSubmit)} disabled={isPending}>
          <Text style={styles.postText}>
            {isPending ? "Posting..." : "Post"}
          </Text>
        </Pressable>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Community selector */}
            <Link href={"groupSelector"} asChild>
              <Pressable style={styles.communityContainer}>
                {group ? (
                  <>
                    {group.image ? (
                      <Image
                        source={{ uri: group.image }}
                        style={{ width: 20, height: 20, borderRadius: 10 }}
                      />
                    ) : null}
                    <Text style={{ fontWeight: "600" }}>{group.name}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.community}>r/</Text>
                    <Text style={{ fontWeight: "600" }}>
                      Select a community
                    </Text>
                  </>
                )}

                <AntDesign name="down" size={16} color="black" />
              </Pressable>
            </Link>

            {/* Inputs */}
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter title"
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    paddingVertical: 20,
                  }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  scrollEnabled={false}
                />
              )}
            />
            {formState.errors.title && (
              <Text style={styles.error}>{formState.errors.title.message}</Text>
            )}

            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Enter description*"
                  style={{
                    paddingVertical: 20,
                  }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  scrollEnabled={false}
                />
              )}
            />
            {formState.errors.description && (
              <Text style={styles.error}>
                {formState.errors.description.message}
              </Text>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  postText: {
    color: "white",
    backgroundColor: "#115BCA",
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 10,
  },
  community: {
    backgroundColor: "black",
    color: "white",
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 10,
    fontWeight: "bold",
  },
  communityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EDEDED",
    padding: 10,
    borderRadius: 20,
    gap: 5,
    marginVertical: 10,
    alignSelf: "flex-start",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
