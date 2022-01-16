import { styled } from "@/stitches.config";
import Link from "next/link";
import { useState } from "react";
import { ClockIcon, SpeechIcon } from "@/components/Icons";
import Upvote from "@/components/Upvote";
import WalletAddress from "../WalletAddress";

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

export interface PostProps {
  title: string;
}
const Post = ({ title }: PostProps) => {
  const [upvoted, setUpvoted] = useState(false);
  const address = "0x0000000000000000000000000000000000000000";

  return (
    <PostRow>
      <div>
        <Upvote upvoted={upvoted} onClick={() => setUpvoted((prev) => !prev)} />
      </div>
      <PostInfo>
        <Title>
          <a href="https://creators.mirror.xyz/">{title}</a>
        </Title>
        <PostMeta>
          <DomainText>creatorcabins.com</DomainText>
          <MetaAddress>
            via{" "}
            <Link href={`/address/${address}`}>
              <a title={`View profile of ${address}`}>
                <WalletAddress address={address} />
              </a>
            </Link>
          </MetaAddress>
        </PostMeta>
        <PostMeta>
          <IconText>
            <ClockIcon /> 3 hours ago
          </IconText>
          <IconText>
            <SpeechIcon /> 15 comments
          </IconText>
        </PostMeta>
      </PostInfo>
    </PostRow>
  );
};

export default Post;
