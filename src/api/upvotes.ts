import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

const createUpvote = async ({
  post_id,
  value,
}: {
  post_id: string;
  value: 1 | -1;
}) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    console.error("User is not authenticated", userError);
    return;
  }

  const user_id = userData.user.id;

  const { error } = await supabase
    .from("upvotes")
    .upsert([{ post_id, value, user_id }])
    .select();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking existing upvote:", error);
    return;
  }
  return console.log("Upvote upserted successfully");
};
export function useCreateUpvote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUpvote,

    onMutate: async (newVote) => {
      await queryClient.cancelQueries({
        queryKey: ["posts", newVote.post_id, "my-upvote"],
      });

      const previousVote = queryClient.getQueryData([
        "posts",
        newVote.post_id,
        "my-upvote",
      ]);

      queryClient.setQueryData(["posts", newVote.post_id, "my-upvote"], {
        value: newVote.value,
      });

      queryClient.setQueryData(["posts"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((post: any) => {
          if (post.id === newVote.post_id) {
            return {
              ...post,
              upvotes: (post.upvotes ?? 0) + newVote.value,
            };
          }
          return post;
        });
      });

      return { previousVote };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "my-upvote"] });
    },

    onError: (_error, _newVote, context) => {
      if (context?.previousVote) {
        queryClient.setQueryData(
          ["posts", _newVote.post_id, "my-upvote"],
          context.previousVote
        );
      }
    },
  });
}

const selectMyVote = async ({ post_id }: { post_id: string }) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    console.error("User is not authenticated", userError);
    return;
  }

  const user_id = userData.user.id;

  const { error, data } = await supabase
    .from("upvotes")
    .select("*")
    .eq("post_id", post_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    console.error("Failed to insert upvote:", error);
  } else {
    console.log("Upvote added successfully");
  }
  return data;
};

export function useSelectMyVote({ post_id }: { post_id: string }) {
  return useQuery({
    queryKey: ["posts", post_id, "my-upvote"],
    queryFn: () => selectMyVote({ post_id }),
    placeholderData: (prev) => prev,
  });
}
