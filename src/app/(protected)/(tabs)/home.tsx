import React, { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import PostListItem from "../../../components/PostListItem";
import Logout from "../../../components/Logout";
import { supabase } from "../../../lib/supabase";
// import { Post } from "../../../types";
import { Tables } from "../../../lib/types";

export type PostWithGroupAndUser = Tables<"posts"> & {
  user: Tables<"users">;
  group: Tables<"groups">;
};
function HomeScreen() {
  const [posts, setPosts] = useState<PostWithGroupAndUser[]>([]);

  useEffect(() => {
    fetchPost();
  }, []);
  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");
    if (error) return console.log(error);
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
