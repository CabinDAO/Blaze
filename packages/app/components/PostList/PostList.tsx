import { styled } from "@/stitches.config";
import { useState } from "react";
import Post from "../Post";
import { v4 as uuidV4 } from "uuid";
import {PostListProps, Sort} from "@/types";


const StyledPostList = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: "$4",
});



const PostList = ({ posts }: {posts: PostListProps}, { sort }: {sort: Sort}) => {

  return (
    <StyledPostList>
      {sort === "newest" && posts.sort((a, b) => a.submissionDate - b.submissionDate).map((post) => <Post key={uuidV4()} {...post} />)}
      {sort === "trending" && posts.sort((a, b) => a.numberOfUpvotes - b.numberOfUpvotes).map((post) => <Post key={uuidV4()} {...post} />)}
      {sort === "controversial" && posts.sort((a, b) => b.numberOfComments - a.numberOfComments).map((post) => <Post key={uuidV4()} {...post} />)}
    </StyledPostList>
  );
};

export default PostList;
