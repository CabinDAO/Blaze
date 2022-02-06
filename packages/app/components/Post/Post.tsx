import { styled } from "@/stitches.config";
import Link from "next/link";
import { ClockIcon, SpeechIcon } from "@/components/Icons";
import Upvote from "@/components/Upvote";
import WalletAddress from "../WalletAddress";
import { useStore } from "@/store/store";
import { formatDistanceToNow, fromUnixTime } from "date-fns";

import supabase from "@/lib/supabaseClient";
import { useWallet } from "../WalletAuth";
import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";

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
  timestamp: number;
  upvotes: number;
}

const Post = ({
  _id,
  title,
  url,
  domainText,
  postedBy,
  timestamp,
  upvotes,
}: PostProps) => {
  const { upvotePostinStore, undoUpvotePost } = useStore();
  const { address, isConnected } = useWallet();

  const upvoteHandler = async (_id: string) => {
    if (isConnected) {
      upvotePostinStore(_id);
      try {
      const { data } = await supabase.from("Posts").select("upvotes").eq("_id", _id).limit(1).single();
      await supabase
        .from('Posts')
        .update({ upvotes: data.upvotes + 1 })
        .eq('_id', _id);
      await supabase.from("Upvotes").insert([{
        _id: uuidv4(),
        upvoter: address,
        post: _id,
        timestamp: getUnixTime(new Date()),
      }]);
      } catch {
        undoUpvotePost(_id);
      }
    } else {
      alert("Please login to upvote");
    }
  };
  return (
    <PostRow>
      <div>
        <Upvote
          upvoted={upvotes > 0 ? true : false}
          count={upvotes}
          onClick={ () => upvoteHandler(_id)}
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
            {formatDistanceToNow(timestamp * 1000)}
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
