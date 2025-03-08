import React, { useState, useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import PostListItem from "../../../components/PostListItem";
import Logout from "../../../components/Logout";
import { useGetPosts } from "../../../api/posts";

function HomeScreen() {
  const { data: posts, error, isLoading } = useGetPosts();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text> Something went wrong try again later </Text>;
  return (
    <View style={{ gap: 10, flex: 1 }}>
      <Logout />
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
    </View>
  );
}

export default HomeScreen;
