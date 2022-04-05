import {styled} from "@/stitches.config";
import Link from "next/link";
import {ClockIcon, SpeechIcon} from "@/components/Icons";
import Upvote from "@/components/Upvote";
import WalletAddress from "../WalletAddress";
import {useStore} from "@/store/store";
import {formatDistanceToNow, fromUnixTime} from "date-fns";

import {useWallet} from "../WalletAuth";
import {useMutation, useQueryClient} from "react-query";
import {useCallback, useState} from "react";
import CommentInput from "@/components/CommentInput";
import Comment from "@/components/Comment";

const PostRow = styled("div", {
  display: "flex",
  columnGap: "$2",
});

const PostInfo = styled("div", {
  flex: 1,
});

const Title = styled("div", {
  fontWeight: "$regular",
  marginTop: "$2",
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
  "&:last-of-type:hover": {
    cursor: "pointer",
    textDecoration: "underline",
  }
});

export interface PostProps {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  created_at: string;
  upvotes: number;
  upvoted?: boolean;
}

const Post = ({
  _id,
  title,
  url,
  domainText,
  postedBy,
  created_at,
  upvotes,
  upvoted,
}: PostProps) => {
  const { address, isAuthenticated } = useWallet();
  const queryClient = useQueryClient();

  const [showComments, setShowComments] = useState(false);

  const {mutate} = useMutation<any, Error, {postId: string}>(
    async ({postId}) => {
      return await fetch(`/api/posts/${postId}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          upvoter: address,
          postId,
        }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
      },
    }
  );

  const upvoteHandler = useCallback(
    (_id: string) => {

      if (isAuthenticated) {
        return mutate({ postId: _id });
      } else {
        alert("Please sign-in to upvote");
      }
    },
    [isAuthenticated, mutate]
  );
  return (
    <PostRow>
      <div>
        <Upvote
          upvoted={upvoted}
          count={upvotes}
          onClick={() => upvoteHandler(_id)}
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
          <IconText>
            <ClockIcon />{" "}
            {formatDistanceToNow(new Date(created_at), {addSuffix: true})}
          </IconText>
          {/* TODO: Set comment count/toggle */}
          <IconText onClick={() => setShowComments(!showComments)}>
            <SpeechIcon fill={1 > 0 ? true : false} />{" "}
            {1 > 0 ? "1" + " comment(s)": "Add a comment"} {}
          </IconText>
        </PostMeta>
        {showComments && 
          <div>
            <CommentInput />
            {/* TODO: loop over comment to render */}
            <Comment 
              _id={""}
              text={"This is a cool comment, wow!"}
              postedBy={postedBy}
              created_at={new Date().toISOString()}
              upvotes={0}
            />
          </div>
        }
      </PostInfo>
    </PostRow>
  );
};

export default Post;
