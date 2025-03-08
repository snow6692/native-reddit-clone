import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

//posts with relations
const fetchPosts = async () => {
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
    queryFn: fetchPosts,
  });
}

const fetchPostById = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, group:groups(*), user:users!posts_user_id_fkey(*)")
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
};

export function useGetPostById(id: string) {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id),
    enabled: !!id,
    // staleTime: 3000,  (consider it up to date for 3 seconds  )
  });
}
