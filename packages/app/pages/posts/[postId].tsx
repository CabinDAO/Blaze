import { useRouter } from "next/router";
import Post from "@/components/Post";
import { useQuery } from "react-query";
import { loadPost } from "@/helpers/posts";
import { useSiweSession } from "@/helpers/siwe";
import { useEnsLookup } from "@/helpers/ens";

export default function PostPage() {
  const router = useRouter();
  const { postId } = router.query;
  const { address, loading } = useSiweSession();
  const { data, status } = useQuery(
    [postId, address],
    () => loadPost(postId as string, address),
    {
      enabled: !!postId,
    }
  );
  const ensLookup = useEnsLookup(data?.postedBy ?? null);

  if (!data) {
    return <div>Post not found.</div>;
  }

  return (
    <div>
      <Post {...data} postedByEns={ensLookup[data?.postedBy]} />
    </div>
  );
}
