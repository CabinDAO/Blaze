import { styled } from "@/stitches.config";
import Post from "../Post";
import { useMemo } from "react";
import { useEnsLookup } from "@/helpers/ens";

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
  upvoted?: boolean;
}
export interface PostListProps {
  loading?: boolean;
  posts: Post[];
}

const PostList = ({ posts, loading = false }: PostListProps) => {
  const addresses: string[] = useMemo(
    () => posts?.map((p) => p.postedBy as string) ?? [],
    [posts]
  );
  // prefetch ens names
  const ensLookup = useEnsLookup(addresses);

  if (posts.length === 0) {
    return (
      <StyledPostList>
        <div>{loading ? "Loading" : "No posts yet"}</div>
      </StyledPostList>
    );
  }

  return (
    <StyledPostList>
      {posts.map((post) => (
        <Post key={post._id} {...post} postedByEns={ensLookup[post.postedBy]} />
      ))}
    </StyledPostList>
  );
};

export default PostList;
