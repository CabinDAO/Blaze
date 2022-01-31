import { styled } from "@/stitches.config";
import { useState } from "react";
import Post from "../Post";

import {PostListProps, Sort} from "@/types";


const StyledPostList = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: "$4",
});



const PostList = ({ posts, sort }) => {

  return (
    <StyledPostList>
      {sort === "newest" && posts.sort((a, b) => a.timeStamp - b.timeStamp).map((post) => <Post key={post._id} {...post} />)}
      {sort === "trending" && posts.sort((a, b) => a.numberOfUpvotes - b.numberOfUpvotes).map((post) => <Post key={post._id} {...post} />)}
      {sort === "controversial" && posts.sort((a, b) => b.numberOfComments - a.numberOfComments).map((post) => <Post key={post._id} {...post} />)}
    </StyledPostList>
  );
};

export default PostList;
