import { styled } from "@/stitches.config";
import Link from "next/link";
import { ClockIcon, SpeechIcon } from "@/components/Icons";
import Upvote from "@/components/Upvote";
import WalletAddress from "../WalletAddress";
import { formatDistanceToNow } from "date-fns";

import { useWallet } from "../WalletAuth";
import { useMutation, useQueryClient, useQuery } from "react-query";
import { useCallback, useState } from "react";
import CommentInput from "@/components/CommentInput";
import Comment from "@/components/Comment";
import supabase from "@/lib/supabase";


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

async function loadComments (postId: string) {
  const { data: comments, error: commentsError }= await supabase
    .from("PostComments")
    .select(`
    _id,
    text,
    postedBy,
    created_at,
    subcomments:SubComments (
      _id,
      text,
      postedBy,
      created_at,
      upvotes
    )
    upvotes
    `)
    .eq("postId", postId)
    .order("created_at", { ascending: true })
  return comments;
}

async function loadCommentCount (postId: string) {
  const { count: commentCount, error: commentCountError }= await supabase
    .from("PostComments")
    .select("*", {count: "exact"})
    .eq("postId", postId)
  return commentCount;
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
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();

  const { data: comments } = useQuery(["comments", _id], () =>
  loadComments(_id),
  {
    enabled: showComments,
  }
  );

  const {data: commentCount} = useQuery(["comments", "commentCount", _id], () =>
  loadCommentCount(_id),
);

  const { mutate } = useMutation<any, Error, { postId: string }>(
    async ({ postId }) => {
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
            {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
          </IconText>
          {/* TODO: Set comment count/toggle */}
          <IconText onClick={() => setShowComments(!showComments)}>
            <SpeechIcon fill={1 > 0 ? true : false} />{" "}
            {commentCount != null && commentCount != undefined && commentCount > 0 ? commentCount?.toString() + " comment(s)" : "Add a comment"} { }
          </IconText>
        </PostMeta>
        {showComments &&
          <div>
            <CommentInput postId={_id} setShowComments={setShowComments}/>
            {comments ? comments.map(comment => <Comment
              key={comment._id}
              _id={comment._id}
              text={comment.text}
              postedBy={comment.postedBy}
              created_at={new Date(comment.created_at).toISOString()}
              upvotes={comment.upvotes}
              upvoted={comment.upvoted}
              subcomments={comment.subcomments}
            />) : null}
          </div>
        }
      </PostInfo>
    </PostRow>
  );
};

export default Post;
