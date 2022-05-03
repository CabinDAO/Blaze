import {styled} from "@/stitches.config";
import Link from "next/link";
import { IComment } from "@/interfaces";
import Upvote from "@/components/Upvote";
import WalletAddress from "@/components/WalletAddress";
import {ClockIcon, SpeechIcon, LargeDiamondIcon } from "@/components/Icons";
import {formatDistanceToNow} from "date-fns";
import {useState} from "react";
import CommentInput from "@/components/CommentInput";

/** Styled components */
const CommentWrapper = styled("div", {
  display: "flex",
  columnGap: "$2",
  marginTop: "$4",
  paddingLeft: "$4",
  position: "relative",
  "&:before": {
    content: "",
    width: "1px",
    height: "100%",
    position: "absolute",
    backgroundColor: "$forest",
    left: "0",
    top: "0"
  },
});

const Text = styled("div", {
  fontWeight: "$regular",
  marginTop: "$1",
  "& a": {
    textDecoration: "none",
  },
});

const Meta = styled("div", {
  fontSize: "$xs",
  display: "flex",
  flexFlow: "row wrap",
  gap: "$2",
  alignItems: "center",

});

const AddComment = styled("div", {
  fontSize: "$xs",
  marginTop: "$2"
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

const SubCommentList = styled("div", {
  marginTop: "$2",
  marginLeft: "$4",
});

const StyledCommentInput = styled(CommentInput, {});

const Comment = ({
  _id,
  postId,
  text,
  postedBy,
  created_at,
  upvotes,
  upvoted,
  subcomments
}: IComment) => {

  const [toggled, setToggled] = useState(true);
  const [inputToggled, setInputToggled] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <CommentWrapper>
      { toggled &&
        <div>
          <Upvote
            upvoted={upvoted}
            count={upvotes}
          />
        </div>
      }
      <div>
        <Meta>
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
          <IconText>
            <div onClick={() => setToggled(!toggled)}>
              <LargeDiamondIcon/>
              { toggled ? " Hide" : " Show"}
            </div>
          </IconText>
        </Meta>
        { toggled && 
          <div>
            <Text>
              { text }
            </Text>
            <SubCommentList>{ subcomments ? subcomments.map(subcomment => <Comment key={subcomment._id} {...subcomment}/>) : null}</SubCommentList>
            {subcomments && <AddComment>
              <IconText onClick={() => setInputToggled(!inputToggled)}>
                <SpeechIcon fill={false} />
                {"Add a comment"}
              </IconText>
            </AddComment>}
            { inputToggled &&
              <StyledCommentInput postId={postId} parentCommentId={_id} setShowComments={setInputToggled}/>
            }
          </div>
        }
      </div>
    </CommentWrapper>
  );
};

export default Comment;
