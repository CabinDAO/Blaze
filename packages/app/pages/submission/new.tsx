import { styled } from "@/stitches.config";
import debounce from "lodash.debounce";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import { 
  Button, 
  Input,
  Text 
} from "@cabindao/topo";
import { useStore } from "@/store/store";
import Title from "@/components/Title";
import Post from "@/components/Post";
import { IPost } from "@/interfaces";

/** Styled components */
const URLInput = styled(Input, {
  flex: "1",
  width: "100%"
});

const SubmitButton = styled(Button, {
  marginTop: "$5"
});

/** Page: 'new' */
const NewSubmission = () => {
  const router = useRouter();
  const { currentProfile } = useStore();

  const [error, setError] = useState<string>('');
  const [postData, setPostData] = useState<IPost>({
    _id: '',
    title: '',
    domainText: '',
    url: '',
    postedBy: currentProfile.walletAddress,
    created_at: new Date().toISOString(),
    upvotes: 0
  });

  /** Fetch post data from the backend */
  const fetchPostData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url) {
      const res = await fetch(`/api/url/metadata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: url
        })
      });
      
      if (res.status !== 200) {
        // Show error and reset metadata on invalid input
        setError('Invalid input, please check the URL and try again.');
        setPostData({
          ...postData,
          title: '',
          domainText: '',
          url: ''
        });
      } else {
        // Set meta data for preview
        const metaData = await res.json();
        setPostData({
          ...postData,
          title: metaData.title || '',
          domainText: metaData.description || metaData.og_description || '',
          url: metaData.url
        });
        setError('');
      }
    }
  };

  const onInputDebounce = useMemo(() => debounce(fetchPostData, 300), []);

  const submitPost = async () => {
    const res = await fetch(`/api/submission/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    });
    
    if (res.status !== 200) {
      // TODO: Error handling
    } else {
      // Set meta data for preview
      const data = await res.json();
      
      // TODO: Add success message
      router.push("/");
    }
  };

  return (
    <div>
      <Title>Submit a link</Title>
      
      <URLInput 
        label={"Paste a link to submit below"}
        placeholder={"https://"} 
        error={error}
        onChange={(e) => onInputDebounce(e)}
        />
        {postData.url && 
          <div>
            <Text>This is what your link will look like once it&apos;s submitted:</Text>
            <Post 
              _id={postData._id}
              title={postData.title} 
              domainText={postData.domainText}
              url={postData.url}
              postedBy={postData.postedBy}
              created_at={postData.created_at}
              upvotes={0}
            />
          </div>
        }
      <SubmitButton 
        onClick={submitPost}
        disabled={!postData.url}
        tone="wheat"
      >
        Submit
      </SubmitButton>
    </div>
  );
};

export default NewSubmission;
