import { styled } from "@/stitches.config";
import Link from "next/link";
import { ClockIcon } from "@/components/Icons";
import Upvote from "@/components/Upvote";
import WalletAddress from "../WalletAddress";
import { useStore } from "@/store/store";
import { formatDistanceToNow } from "date-fns";

import { useWallet } from "../WalletAuth";
import { useMutation, useQueryClient } from "react-query";
import { useCallback, useMemo } from "react";

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
  const queryClient = useQueryClient();
  const { sort } = useStore();

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
