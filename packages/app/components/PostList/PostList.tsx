import { styled } from "@/stitches.config";
import Post from "../Post";

interface PostListProps {
    posts: {title: string}[];
    sort: "newest"|"trending";
}
const StyledPostList = styled("div", {
    display: "flex",
    flexDirection: "column",
    rowGap: "$4",
  });

const PostList = ({posts, sort}: PostListProps) => {

  return <StyledPostList>

  </StyledPostList>;
};

export default PostList;
