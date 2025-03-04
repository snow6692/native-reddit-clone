import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import posts from "../../../../assets/data/posts.json";
import PostListItem from "../../../components/PostListItem";
function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const detailedPost = posts.find((post) => post.id === id);
  if (!detailedPost) return <Text>Post not found </Text>;
  return (
    <View>
      <PostListItem post={detailedPost} isDetailedPost />
    </View>
  );
}

export default PostPage;
