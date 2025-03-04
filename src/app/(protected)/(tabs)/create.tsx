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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { postZod } from "../../../validation";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Create() {
  const { control, formState, handleSubmit, reset } = useForm<postZod>({
    defaultValues: {
      description: "",
      title: "",
      image: "",
    },
    resolver: zodResolver(postZod),
  });

  const goBack = () => {
    router.back();
    reset();
  };

  const onSubmit = (data: postZod) => {
    alert(
      `Title is :${data.title} ${
        data.description ? ` description is ${data.description}` : ""
      } `
    );
    reset();
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
        <Pressable onPress={handleSubmit(onSubmit)}>
          <Text style={styles.postText}>Post</Text>
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
            <View style={styles.communityContainer}>
              <Text style={styles.community}>r/</Text>
              <Text style={{ fontWeight: "600" }}>Select a community</Text>
              <AntDesign name="down" size={16} color="black" />
            </View>

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
