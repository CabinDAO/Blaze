import { styled } from "@/stitches.config";
import { useState } from "react";
import Post from "../Post";
import {v4 as uuidV4} from "uuid";
import { PostListProps } from "@/types";


const StyledPostList = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: "$4",
});

const PostList = ({ posts, sort }: PostListProps) => {
  return (
    <StyledPostList>
      {sort === "newest"
        ? posts.sort((a, b) => a.submissionDate - b.submissionDate).map((post) => <Post key={uuidV4()} {...post} />)
        : posts.map((post) => <Post key={uuidV4()} {...post} />)}
    </StyledPostList>
  );
};

export default PostList;
