import { styled } from "@/stitches.config";
import Post from "../Post";
import { useEffect } from "react";
import { useStore } from "@/store/store";
import supabase from "@/lib/supabase";

const StyledPostList = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: "$4",
});

export interface Post {
  _id: string;
  created_at: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  upvotes: number;
}
export interface PostListProps {
  posts: Post[];
}

const PostList = ({ posts }: PostListProps) => {
  const { currentProfile, incrementProfilePostsUpvoted } = useStore();

  useEffect(() => {
    const Upvotes = supabase
      .from("Upvotes")
      .on("INSERT", async (payload) => {
        if (
          currentProfile &&
          payload.new.upvoter === currentProfile.walletAddress
        ) {
          incrementProfilePostsUpvoted();
          await supabase
            .from("Profiles")
            .update({ postsUpvoted: currentProfile.postsUpvoted + 1 })
            .eq("walletAddress", currentProfile.walletAddress);
        }
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(Upvotes);
    };
  });

  if (posts.length === 0) {
    return (
      <StyledPostList>
        <div>No posts yet</div>
      </StyledPostList>
    );
  }

  return (
    <StyledPostList>
      {posts.map((post) => (
        <Post key={post._id} {...post} />
      ))}
    </StyledPostList>
  );
};

export default PostList;
