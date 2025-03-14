import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { formatDistanceToNowStrict } from "date-fns";
import { Link } from "expo-router";
import { PostWithGroupAndUser } from "../lib/redditTypes";
import { useCreateUpvote, useSelectMyVote } from "../api/upvotes";
import { useQueryClient } from "@tanstack/react-query";

type PostListItemProps = {
  post: PostWithGroupAndUser;
  isDetailedPost?: boolean;
};

export default function PostListItem({
  post,
  isDetailedPost,
}: PostListItemProps) {
  const { mutate } = useCreateUpvote();
  const { data: myVote } = useSelectMyVote({ post_id: post.id });
  const ShowImage = isDetailedPost || post.image;
  const ShowDescription = isDetailedPost || !post.image;
  const isUpvoted = myVote?.value === 1;
  const isDownvoted = myVote?.value === -1;
  const handleUpvote = (value: 1 | -1) => {
    if (isUpvoted && value === 1) {
      mutate({ post_id: post.id, value: -1 }); //  
    } else if (isDownvoted && value === -1) {
      mutate({ post_id: post.id, value: 1 }); //
    } else {
      mutate({ post_id: post.id, value });
    }
  };

  return (
    <Link href={`post/${post.id}`} asChild>
      <Pressable
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          gap: 7,
          borderBottomColor: "lightgrey",
          borderBottomWidth: 0.5,
          backgroundColor: "white",
          width: "100%",
        }}
      >
        {/* HEADER */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {post.image ? (
            <Image
              source={{ uri: post.group.image! }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                marginRight: 5,
              }}
            />
          ) : null}
          <View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{ fontWeight: "bold", fontSize: 13, color: "#3A3B3C" }}
              >
                {post.group.name}
              </Text>
              <Text
                style={{ color: "grey", fontSize: 13, alignSelf: "flex-start" }}
              >
                {formatDistanceToNowStrict(new Date(post.created_at!))}
              </Text>
            </View>
            {isDetailedPost && (
              <Text style={{ fontSize: 13, color: "#2E5DAA" }}>
                {post.user.name}
              </Text>
            )}
          </View>
          <Pressable
            onPress={() => console.error("Pressed")}
            style={{
              marginLeft: "auto",
              backgroundColor: "#0d469b",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                paddingVertical: 2,
                paddingHorizontal: 7,
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              Join
            </Text>
          </Pressable>
        </View>

        {/* CONTENT */}
        <Text style={{ fontWeight: "bold", fontSize: 17, letterSpacing: 0.5 }}>
          {post.title}
        </Text>
        {ShowImage && post.image && (
          <Image
            source={{ uri: post.image }}
            style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 15 }}
          />
        )}

        {ShowDescription && post.description && (
          <Text numberOfLines={isDetailedPost ? undefined : 4}>
            {post.description}
          </Text>
        )}

        {/* FOOTER */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={[{ flexDirection: "row" }, styles.iconBox]}>
              <MaterialCommunityIcons
                onPress={() => handleUpvote(1)}
                name={isUpvoted ? "arrow-up-bold" : "arrow-up-bold-outline"}
                size={19}
                color={isUpvoted ? "crimson" : "black"}
              />
              <Text
                style={{
                  fontWeight: "500",
                  marginLeft: 5,
                  alignSelf: "center",
                }}
              >
                {post.upvotes ?? 0}
              </Text>
              <View
                style={{
                  width: 1,
                  backgroundColor: "#D4D4D4",
                  height: 14,
                  marginHorizontal: 7,
                  alignSelf: "center",
                }}
              />
              <MaterialCommunityIcons
                onPress={() => handleUpvote(-1)}
                name={
                  isDownvoted ? "arrow-down-bold" : "arrow-down-bold-outline"
                }
                size={19}
                color={isDownvoted ? "crimson" : "black"}
              />
            </View>
            <View style={[{ flexDirection: "row" }, styles.iconBox]}>
              <MaterialCommunityIcons
                name="comment-outline"
                size={19}
                color="black"
              />
              <Text
                style={{
                  fontWeight: "500",
                  marginLeft: 5,
                  alignSelf: "center",
                }}
              >
                {/* {post.nr_of_comments} */} 5
              </Text>
            </View>
          </View>
          <View style={{ marginLeft: "auto", flexDirection: "row", gap: 10 }}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={19}
              color="black"
              style={styles.iconBox}
            />
            <MaterialCommunityIcons
              name="share-outline"
              size={19}
              color="black"
              style={styles.iconBox}
            />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    borderWidth: 0.5,
    borderColor: "#D4D4D4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
});
