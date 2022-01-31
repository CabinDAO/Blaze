import {styled} from "@/stitches.config";
import Link from "next/link";
import {ClockIcon, SpeechIcon} from "@/components/Icons";
import Upvote from "@/components/Upvote";
import WalletAddress from "../WalletAddress";
import {useStore} from "@/store/store";
import {PostProps} from "@/types";
import {formatDistanceToNow, fromUnixTime} from "date-fns";
// import {useEnsLookup} from "wagmi";

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
<<<<<<< HEAD
  "&:last-of-type:hover": {
    cursor: "pointer",
    textDecoration: "underline",
  },
=======
  // "&:last-of-type:hover": {
  //   cursor: "pointer",
  //   textDecoration: "underline",
  // }
>>>>>>> feat/back-end
});

const Post = ({
  id,
  title,
  url,
  domainText,
  walletAddress,
  submissionDate,
  numberOfComments,
  numberOfUpvotes,
}: PostProps) => {
  const {upvotePost} = useStore();

<<<<<<< HEAD
  // const [{data: ensName}] = useEnsLookup({
  //   address: walletAddress,
  // });
=======
const Post = ({ id, title, url, domainText, postedBy, timeStamp, numberOfComments, numberOfUpvotes }: PostProps) => {
  const { upvotePost } = useStore();
>>>>>>> feat/back-end

  return (
    <PostRow>
      <div>
        <Upvote
          upvoted={numberOfUpvotes > 0 ? true : false}
          count={numberOfUpvotes}
          onClick={() => upvotePost(id)}
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
<<<<<<< HEAD
            <Link href={`/address/${walletAddress}`}>
              <a title={`View profile of ${walletAddress}`}>
                <WalletAddress
                  address={walletAddress}
                  // ens={ensName ? {name: ensName} : null}
                />
=======
            <Link href={`/address/${postedBy}`}>
              <a title={`View profile of ${postedBy}`}>
                <WalletAddress address={postedBy} />
>>>>>>> feat/back-end
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
