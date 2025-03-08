import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

//posts with relations
const fetchPost = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, group:groups(*), user:users!posts_user_id_fkey(*)");

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
};
export function useGetPosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPost,
  });
}
