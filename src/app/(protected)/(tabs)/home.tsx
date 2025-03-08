import React, { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import PostListItem from "../../../components/PostListItem";
import Logout from "../../../components/Logout";
import { supabase } from "../../../lib/supabase";
function HomeScreen() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPost();
  }, []);
  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");
    if (error) console.log(error);
    setPosts(data);
  };
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
