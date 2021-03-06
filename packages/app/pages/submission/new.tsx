import { styled } from "@/stitches.config";
import debounce from "lodash.debounce";
import { useCallback, useState, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { Button, Input, Text } from "@cabindao/topo";
import { useStore } from "@/store/store";
import Title from "@/components/Title";
import Post from "@/components/Post";
import { IPost } from "@/interfaces";

/** Styled components */
const URLInput = styled(Input, {
  flex: "1",
  width: "100%",
});

const SubmitButton = styled(Button, {
  marginTop: "$5",
});

async function fetchMetadata(url: string) {
  const res = await fetch(`/api/url/metadata`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
    }),
  });
  return res.json();
}

async function submitPostData(post: IPost) {
  const res = await fetch(`/api/submission/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  return res.json();
}

/** Page: 'new' */
const NewSubmission = () => {
  const router = useRouter();
  const {
    siwe: { address },
  } = useStore();

  const [error, setError] = useState<string>("");
  // TODO: Use real wallet address
  const [postData, setPostData] = useState<IPost>({
    _id: "",
    title: "",
    domainText: "",
    url: "",
    created_at: new Date().toISOString(),
    upvotes: 0,
    postedBy: "",
  });

  const { mutate } = useMutation(fetchMetadata, {
    onMutate() {
      setError("");
    },
    onSuccess(metadata) {
      setPostData((state) => ({
        ...state,
        title: metadata.title ?? "",
        domainText: metadata.description ?? metadata.og_description ?? "",
        url: metadata.url,
      }));
    },
    onError() {
      setError("Invalid input, please check the URL and try again.");
      setPostData((state) => ({
        ...state,
        title: "",
        domainText: "",
        url: "",
      }));
    },
  });

  /** Fetch post data from the backend */
  const fetchPostData = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value;
      console.log("url", url);
      if (url.length > 0) {
        mutate(url);
      }
    },
    [mutate]
  );

  const onInputDebounce = useMemo(
    () => debounce(fetchPostData, 300),
    [fetchPostData]
  );

  const queryClient = useQueryClient();

  const { mutate: submitPost } = useMutation(submitPostData, {
    onMutate() {
      setError("");
    },
    onError() {
      setError("Failed to submit post.");
    },
    onSuccess() {
      // clear posts on successful post
      queryClient.invalidateQueries("posts");
      router.push("/");
    },
  });

  const onSubmitForm = useCallback(() => {
    if (address) {
      submitPost({ ...postData, postedBy: address });
    }
  }, [submitPost, postData, address]);

  return (
    <div>
      <Title>Submit a link</Title>

      <URLInput
        label={"Paste a link to submit below"}
        placeholder={"https://"}
        error={error}
        onChange={(e) => onInputDebounce(e)}
      />
      {postData.url && (
        <div>
          <Text>
            This is what your link will look like once it&apos;s submitted:
          </Text>
          <Post
            _id={postData._id}
            title={postData.title}
            domainText={postData.domainText}
            url={postData.url}
            postedBy={address ?? ""}
            created_at={postData.created_at}
            upvotes={0}
            upvoteDisabled
          />
        </div>
      )}
      <SubmitButton
        onClick={onSubmitForm}
        disabled={!postData.url}
        tone="wheat"
      >
        Submit
      </SubmitButton>
    </div>
  );
};

export default NewSubmission;
