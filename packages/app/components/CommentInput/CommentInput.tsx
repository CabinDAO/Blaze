import {styled} from "@/stitches.config";
import { useStore } from "@/store/store";
import { useRouter } from "next/router";
import { useState } from "react";
import { 
  Button, 
  Input
} from "@cabindao/topo";
import { IComment } from "@/interfaces";

/** Styled components */
const CommentInputWrapper = styled("div", {
  marginTop: "$3"
});

const InputField = styled(Input, {
  flex: "1",
  width: "100%"
});

const SubmitButton = styled(Button, {
  marginTop: "$3"
});

const CancelButton = styled(Button, {
  marginTop: "$3",
  marginLeft: "$2"
});

const CommentInput = () => {
  const router = useRouter();
  const { currentProfile } = useStore();

  const [commentData, setCommentData] = useState<IComment>({
    _id: '',
    text: '',
    postedBy: currentProfile.walletAddress,
    created_at: new Date().toISOString(),
    upvotes: 0
  });

  const submitComment = async () => {
    const res = await fetch(`/api/comment/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commentData)
    });
    
    if (res.status === 200) {
      router.push("/");
    }
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentData({
      ...commentData,
      text: e.target.value
    })
  };

  return (
    <CommentInputWrapper>
      <InputField
        placeholder={"Your comment"}
        onChange={(e) => onInput(e)}
        />
      <SubmitButton 
        onClick={submitComment}
        tone="wheat"
      >
        Submit
      </SubmitButton>
      <CancelButton 
        type="secondary"
      >
        Cancel
      </CancelButton>
    </CommentInputWrapper>
  );
};

export default CommentInput;
