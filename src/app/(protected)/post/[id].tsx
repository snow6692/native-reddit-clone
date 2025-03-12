import { useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, View } from "react-native";
import PostListItem from "../../../components/PostListItem";
import { useDeletePost, useGetPostById } from "../../../api/posts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../providers/AuthProvider";
import comments from "../../../../assets/data/comments.json";
import CommentListItem from "../../../components/CommentListItem";
function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [comment, setComment] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { data: post, error, isLoading } = useGetPostById(id);
  const { mutate, isPending } = useDeletePost();
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  if (isLoading) return <ActivityIndicator />;
  if (error || !post) return <Text> Post not found </Text>;

  const postComments = comments.filter(
    (comment) => comment.post_id === "post-1"
  );
  console.log(postComments);
  const handelRemovePost = async () => {
    mutate(post.id, {
      onSuccess: () => {
        Toast.show("Post deleted Successfully", { type: "success" });
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        router.back();
      },
      onError: (error) => {
        Toast.show(`Something went wrong: ${error.message} `, {
          type: "error",
        });
      },
    });
  };
  const confirmDeletePost = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handelRemovePost(),
          style: "destructive",
        },
      ]
    );
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={insets.top + 10}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              {post.user_id === userId && (
                <Entypo
                  onPress={confirmDeletePost}
                  name="trash"
                  size={24}
                  color={isPending ? "gray" : "white"}
                  disabled={isPending}
                />
              )}

              <AntDesign name="search1" size={24} color="white" />
              <MaterialIcons name="sort" size={27} color="white" />
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </View>
          ),
          animation: "slide_from_bottom",
        }}
      />

      <FlatList
        ListHeaderComponent={<PostListItem post={post} isDetailedPost />}
        data={postComments}
        renderItem={({ item }) => <CommentListItem comment={item} />}
      />
      <View
        style={{
          paddingBottom: insets.bottom,
          borderBottomColor: "black",
          padding: 20,
          backgroundColor: "white",
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 4,
        }}
      >
        <TextInput
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder="Join the conversation"
          style={{
            backgroundColor: "#E4E4E4",
            padding: 10,
            borderRadius: 5,
          }}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        {isInputFocused ? (
          <Pressable
            style={{
              backgroundColor: "#0d469b",
              borderRadius: 15,
              marginLeft: "auto",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            <Text
              style={{
                color: "white",
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              Reply
            </Text>
          </Pressable>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

export default PostPage;
