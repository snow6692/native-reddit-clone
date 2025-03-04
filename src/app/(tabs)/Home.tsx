import React from "react";
import { FlatList, Text, View } from "react-native";
import PostListItem from "../../components/PostListItem";
import posts from "../../../assets/data/posts.json";
import Logout from "../../components/Logout";
function HomeScreen() {
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
