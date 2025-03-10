import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, View } from "react-native";
import PostListItem from "../../../components/PostListItem";
import { useDeletePost, useGetPostById } from "../../../api/posts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabase";
import { getUserId } from "../../../api/users";
import { useAuth } from "../../../providers/AuthProvider";

function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, error, isLoading } = useGetPostById(id);
  const { mutate, isPending } = useDeletePost();
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();

  const insets = useSafeAreaInsets();
  if (isLoading) return <ActivityIndicator />;
  if (error || !post) return <Text> Post not found </Text>;

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
      <PostListItem post={post} isDetailedPost />
    </KeyboardAvoidingView>
  );
}

export default PostPage;
