import { styled } from "@/stitches.config";
import Upvote from "../Upvote";

const PostRow = styled("div", {
  display: "flex",
  columnGap: "$2",
});
const PostInfo = styled("div", {
  flex: 1,
});

const Post = () => {
  return (
    <PostRow>
      <Upvote />
      <PostInfo>Post component</PostInfo>
    </PostRow>
  );
};

export default Post;
