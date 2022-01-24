import { styled } from "@/stitches.config";
import Link from "next/link";
import { useState } from "react";
import { ClockIcon, SpeechIcon } from "@/components/Icons";
import Upvote from "@/components/Upvote";
import WalletAddress from "../WalletAddress";
import { useStore } from "@/store/store";
import { PostProps } from "@/types";

const PostRow = styled("div", {
  display: "flex",
  columnGap: "$2",
});
const PostInfo = styled("div", {
  flex: 1,
  // display: "flex",
  // flexDirection: "column",
});
const Title = styled("div", {
  fontWeight: "$regular",
  "& a": {
    textDecoration: "none",
  },
});

const PostMeta = styled("div", {
  fontSize: "$xs",
  display: "flex",
  flexFlow: "row wrap",
  gap: "$2",
  alignItems: "baseline",
});

const DomainText = styled("span", {
  fontWeight: "$regular",
});

const MetaAddress = styled("span", {
  fontFamily: "$mono",
});

const IconText = styled("span", {
  display: "flex",
  alignItems: "center",
  gap: "$1",
});


const Post = ({ id, title, url, domainText, walletAddress, submissionDate, numberOfComments, numberOfUpvotes }: PostProps) => {
  const { upvotePost } = useStore();

  return (
    <PostRow>
      <div>
        <Upvote upvoted={numberOfUpvotes > 0 ? true : false} count={numberOfUpvotes} onClick={() => upvotePost(id)} />
      </div>
      <PostInfo>
        <Title>
          <a href={url}>{title}</a>
        </Title>
        <PostMeta>
          <DomainText>{domainText}</DomainText>
          <MetaAddress>
            via{" "}
            <Link href={`/address/${walletAddress}`}>
              <a title={`View profile of ${walletAddress}`}>
                <WalletAddress address={walletAddress} />
              </a>
            </Link>
          </MetaAddress>
        </PostMeta>
        <PostMeta>
          <IconText>
            <ClockIcon /> {submissionDate} hours ago
          </IconText>
          <IconText>
            <SpeechIcon /> {numberOfComments.toString()} comments
          </IconText>
        </PostMeta>
      </PostInfo>
    </PostRow>
  );
};

export default Post;
