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
    .select()
    .single();

  if (error) {
    console.error("Failed to insert upvote:", error);
  } else {
    console.log("Upvote added successfully");
  }
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

      return { previousVote };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
    .single();

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
