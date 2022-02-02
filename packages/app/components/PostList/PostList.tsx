import { styled } from "@/stitches.config";
import Post from "../Post";


const StyledPostList = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: "$4",
});

export interface PostProps {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  timeStamp: number;
  numberOfComments: number;
  numberOfUpvotes: number;
}
export type PostListProps = PostProps[];
export type Sort = "newest" | "trending" | "controversial";


const PostList = ({ posts }: {posts: PostListProps}, { sort }: { sort: Sort } ) => {

  return (
    <StyledPostList>
      {sort === "newest" && posts.sort((a, b) => a.timeStamp - b.timeStamp).map((post) => <Post key={post._id} {...post} />)}
      {sort === "trending" && posts.sort((a, b) => a.numberOfUpvotes - b.numberOfUpvotes).map((post) => <Post key={post._id} {...post} />)}
      {sort === "controversial" && posts.sort((a, b) => b.numberOfComments - a.numberOfComments).map((post) => <Post key={post._id} {...post} />)}
    </StyledPostList>
  );
};

export default PostList;
