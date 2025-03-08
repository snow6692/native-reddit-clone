import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import PostListItem from "../../../components/PostListItem";
import { useGetPostById } from "../../../api/posts";
function PostPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: post, error, isLoading } = useGetPostById(id);
  if (isLoading) return <ActivityIndicator />;
  if (error || !post) return <Text> Post not found </Text>;

  return (
    <View>
      <PostListItem post={post} isDetailedPost />
    </View>
  );
}

export default PostPage;
