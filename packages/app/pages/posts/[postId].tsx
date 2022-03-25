import { useRouter } from "next/router";
import Post from "@/components/Post";
import { useQuery } from "react-query";
import { loadPost } from "@/helpers/posts";
import { useStore } from "@/store/store";

export default function PostPage() {
  const router = useRouter();
  const {
    siwe: { address },
  } = useStore();
  const { postId } = router.query;
  const { data } = useQuery([postId, address], () =>
    loadPost(postId as string, address)
  );

  if (!data) {
    return <div>Post not found.</div>;
  }

  return (
    <div>
      <Post {...data} />
    </div>
  );
}
