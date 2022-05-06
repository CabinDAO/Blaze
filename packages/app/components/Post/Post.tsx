import { styled } from "@/stitches.config";
import Link from "next/link";

import { useStore } from "@/store/store";

import { useCallback, useMemo, useState } from "react";
import { ClockIcon, SpeechIcon } from "@/components/Icons";
import Upvote from "@/components/Upvote";
import { formatDistanceToNow } from "date-fns";
import WalletAddress from "../WalletAddress";

import { useWallet } from "../WalletAuth";
import { useMutation, useQueryClient, useQuery } from "react-query";
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

const IconLink = styled("a", {
  display: "flex",
  alignItems: "center",
  gap: "$1",
});

export interface PostProps {
  _id: string;
  title: string;
  domainText: string;
  url: string;
  postedBy: string;
  postedByEns?: string | null;
  created_at: string;
  upvotes: number;
  upvoted?: boolean;
  upvoteDisabled?: boolean;
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

async function loadCommentCount (postId: string) 
{
  //TODO: This is a hack to get the comment count client-side. Replace with Supabase function eventually
  const { data: comments, error: commentsError }= await supabase
    .from("PostComments")
    .select(`
    _id,
    subcomments:SubComments (
      _id
    )
    `)
    .eq("postId", postId);
    if(commentsError) console.log(commentsError);
    
    if (!comments) {
      return 0;
    } else {
      let totalComments = comments?.length;
      for (let i = 0; i < comments.length; i++) {
        const subComments = comments[i].subcomments;
        if (subComments) {
          totalComments += subComments.length;
        }
      }
      return totalComments;
    }

  
}

const Post = ({
  _id,
  title,
  url,
  domainText,
  postedBy,
  postedByEns,
  created_at,
  upvotes,
  upvoted,
  upvoteDisabled = false,
}: PostProps) => {
  const { address, isAuthenticated } = useWallet();
  const [showComments, setShowComments] = useState(false);
  const queryClient = useQueryClient();
  const { sort } = useStore();

  const { data: comments } = useQuery(["comments", _id], () =>
  loadComments(_id),
  {
    enabled: showComments,
  }
  );

  const {data: commentCount} = useQuery(["comments", _id, { count: true }], () =>
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
      onMutate: async ({ postId }) => {
        await queryClient.cancelQueries(["posts", sort, address]);
        const previousPosts = queryClient.getQueryData<
          {
            _id: string;
            upvotes: number;
            upvoted: boolean;
          }[]
        >(["posts", sort, address]);

        if (previousPosts) {
          queryClient.setQueryData(
            ["posts", sort, address],
            previousPosts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    upvotes: post.upvoted
                      ? Math.max(0, post.upvotes - 1)
                      : post.upvotes + 1,
                    upvoted: !post.upvoted,
                  }
                : post
            )
          );
        }
        return { previousPosts };
      },
      onError: (_err, _postUpvote, context: any) => {
        queryClient.setQueryData(["posts"], context.previousPosts);
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

  // parse UTC time
  const timestampMessage = useMemo(() => {
    return formatDistanceToNow(new Date(created_at), { addSuffix: true });
  }, [created_at]);

  return (
    <PostRow>
      <div>
        <Upvote
          upvoted={upvoted}
          count={upvotes}
          onClick={() => upvoteHandler(_id)}
          disabled={upvoteDisabled}
        />
      </div>
      <PostInfo>
        <Title>
          <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
        </Title>
        <PostMeta>
          <DomainText>{domainText}</DomainText>
          <MetaAddress>
            via{" "}
            <Link href={`/address/${postedBy}`}>
              <a title={`View profile of ${postedBy}`}>
                <WalletAddress
                  address={postedBy}
                  ens={{ name: postedByEns ?? null }}
                />
              </a>
            </Link>
          </MetaAddress>
        </PostMeta>
        <PostMeta>
          <Link href={`/posts/${_id}`} passHref>
            <IconLink>
              <ClockIcon />
              {timestampMessage}
            </IconLink>
          </Link>
          <IconText onClick={() => setShowComments(!showComments)}>
            <SpeechIcon fill={commentCount != null && commentCount != undefined && commentCount > 0 ? true : false} />{" "}
            {commentCount != null && commentCount != undefined && commentCount > 0 ? commentCount?.toString() + " comment(s)" : "Add a comment"} { }
          </IconText>
        </PostMeta>
        {showComments &&
          <div>
            <CommentInput postId={_id} setShowComments={setShowComments}/>
            {comments ? comments.map(comment => <Comment
              key={comment._id}
              _id={comment._id}
              postId={_id}
              text={comment.text}
              postedBy={comment.postedBy}
              created_at={new Date(comment.created_at).toISOString()}
              upvotes={comment.upvotes}
              subcomments={comment.subcomments}
            />) : null}
          </div>
        }
      </PostInfo>
    </PostRow>
  );
};

export default Post;
