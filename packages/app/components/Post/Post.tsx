import { styled } from "@/stitches.config";
import Link from "next/link";
import { ClockIcon, SpeechIcon } from "@/components/Icons";
import Upvote from "@/components/Upvote";
import WalletAddress from "../WalletAddress";
import { useStore } from "@/store/store";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { upvotePostinDb, auth, setupThreadClient } from "@/lib/db";
import { ThreadID } from "@textile/hub";
import {useAccount} from "wagmi";

const PostRow = styled("div", {
  display: "flex",
  columnGap: "$2",
});
const PostInfo = styled("div", {
  flex: 1,
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
  // "&:last-of-type:hover": {
  //   cursor: "pointer",
  //   textDecoration: "underline",
  // }
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

const Post = ({
  _id,
  title,
  url,
  domainText,
  postedBy,
  timeStamp,
  numberOfComments,
  numberOfUpvotes,
}: PostProps) => {
  const { upvotePostinStore, isLoggedIn } = useStore();
  
  const upvoteHandler = async (_id: string) => {
    if (isLoggedIn) {
      const userAuth = await auth({
        key: process.env.NEXT_PUBLIC_TEXTILE_API_KEY || "",
        secret: process.env.NEXT_PUBLIC_TEXTILE_API_SECRET || "",
      });
      const client = await setupThreadClient(userAuth);
      const threadList = await client.listDBs();
      const threadId = ThreadID.fromString(threadList[0].id);
      // await upvotePostinDb(client, threadId, _id, currentProfile.walletAddress);
      upvotePostinStore(_id);
  } else {
    alert("Please login to upvote");
    }
  };
  return (
    <PostRow>
      <div>
        <Upvote
          upvoted={numberOfUpvotes > 0 ? true : false}
          count={numberOfUpvotes}
          onClick={async () => await upvoteHandler(_id)}
        />
      </div>
      <PostInfo>
        <Title>
          <a href={url}>{title}</a>
        </Title>
        <PostMeta>
          <DomainText>{domainText}</DomainText>
          <MetaAddress>
            via{" "}
            <Link href={`/address/${postedBy}`}>
              <a title={`View profile of ${postedBy}`}>
                <WalletAddress address={postedBy} />
              </a>
            </Link>
          </MetaAddress>
        </PostMeta>
        <PostMeta>
          <IconText>
            <ClockIcon />{" "}
            {formatDistanceToNow(fromUnixTime(timeStamp), {
              addSuffix: true,
              includeSeconds: true,
            })}
          </IconText>
          {/* <IconText>
            <SpeechIcon fill={numberOfUpvotes > 0 ? true : false} />{" "}
            {numberOfUpvotes > 0 ? numberOfComments.toString() + " comments": "Add a comment"} {}
          </IconText> */}
        </PostMeta>
      </PostInfo>
    </PostRow>
  );
};

export default Post;
