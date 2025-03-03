import React from "react";
import { FlatList, Text, View } from "react-native";
import PostListItem from "../../components/PostListItem";
import posts from "../../../assets/data/posts.json";
function HomeScreen() {
  return (
    <View style={{ margin: "auto", width: "95%", height: "95%" }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
      />
    </View>
  );
}

export default HomeScreen;
