import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { TablesInsert } from "../lib/supabase.types";

export type CreatePostTypes = TablesInsert<"posts">;

//posts with relations
const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, group:groups(*), user:users!posts_user_id_fkey(*)")
    .order("created_at", { ascending: false });

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

//get post by id
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

//create post
const createPost = async (newPost: CreatePostTypes) => {
  const { data, error } = await supabase
    .from("posts")
    .insert(newPost)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};
export function useCreatePost() {
  return useMutation({
    mutationFn: createPost,
  });
}

// delete post
const deletePostById = async (id: string) => {
  const { data, error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
};

export function useDeletePost() {
  return useMutation({
    mutationFn: deletePostById,
  });
}
