import { useRouter } from "next/router";

import { StickyTabBar, TabLink } from "@/components/TabBar";
import WalletAddress from "@/components/WalletAddress";
import PostList from "@/components/PostList";
import { useQuery } from "react-query";
import supabase from "@/lib/supabaseClient";

export const getServerSideProps = async ({
  params,
}: {
  params: { address: string };
}) => {
  const { address } = params;
  const isValid = address && address.length === 42;

  return { props: { isValid } };
};

async function fetchProfilePosts(address: string) {
  let { data: posts, error: postsError } = await supabase
    .from("Posts")
    .select("*")
    .filter("postedBy", "eq", address)
    .order("created_at", { ascending: false })
    .order("_id", { ascending: true })
    .limit(25);
  return posts;
}

export default function Address({ isValid }: { isValid: boolean }) {
  const router = useRouter();
  const { address } = router.query;

  const { data: posts } = useQuery({
    queryKey: ["posts", "address", address],
    queryFn: () => fetchProfilePosts(address as string),
    enabled: !!address,
  });

  if (!isValid) {
    return <div>Address not found.</div>;
  }

  // get posts submitted by user
  return (
    <div>
      <div>
        <WalletAddress address={address as string} />
      </div>
      <StickyTabBar>
        <TabLink active>Submissions</TabLink>
      </StickyTabBar>

      <PostList posts={posts ?? []} sort="newest" />
    </div>
  );
}
