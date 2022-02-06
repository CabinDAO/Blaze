import { styled } from "@/stitches.config";
import Post from "../Post";
import { useEffect } from "react";
import { useStore } from "@/store/store";
import supabase from "@/lib/supabaseClient";


const StyledPostList = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: "$4",
});

export interface Post {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  timestamp: number;
  upvotes: number;
}
export type Sort = "newest" | "trending" | "controversial";
export interface PostListProps{
  posts: Post[];
  sort: Sort;
};




const PostList = ({ posts, sort }: PostListProps ) => {
  const { currentProfile, incrementProfilePostsUpvoted } = useStore();

  useEffect(() => {
    const Upvotes = supabase
    .from('Upvotes')
    .on('INSERT', async (payload) => {
        if (currentProfile && payload.new.upvoter === currentProfile.walletAddress) {
          incrementProfilePostsUpvoted();
          await supabase.from('Profiles').update({ postsUpvoted: currentProfile.postsUpvoted + 1 }).eq('walletAddress', currentProfile.walletAddress);
      }
    })
    .subscribe();
    return () => {
      supabase.removeSubscription(Upvotes);
    };
  });

  return (
    <StyledPostList>
      {sort === "newest" && posts.sort((a, b) => a.timestamp - b.timestamp).map((post) => <Post key={post._id} {...post} />)}
      {sort === "trending" && posts.sort((a, b) => a.upvotes - b.upvotes).map((post) => <Post key={post._id} {...post} />)}
      {/* {sort === "controversial" && posts.sort((a, b) => b.comments - a.comments).map((post) => <Post key={post._id} {...post} />)} */}
    </StyledPostList>
  );
};

export default PostList;
