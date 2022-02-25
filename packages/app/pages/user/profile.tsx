import PostList from "@/components/PostList";
import ProfileCard from "@/components/Profile";
import { StickyTabBar, TabLink } from "@/components/TabBar";
import { useWallet } from "@/components/WalletAuth";
import supabase from "@/lib/supabaseClient";
import { useState } from "react";
import { useQuery } from "react-query";

interface Post {
  _id: string;
  id: string;
  title: string;
  url: string;
  postedBy: string;
  upvotes: number;
  timestamp: number;
  domainText: string;
}

async function fetchProfilePosts(address: string) {
  let { data: posts, error: postsError } = await supabase
    .from<Post>("Posts")
    .select("*")
    .filter("postedBy", "eq", address)
    .order("timestamp", { ascending: false })
    .order("_id", { ascending: true })
    .limit(25);
  return posts;
}

export default function Profile() {
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState(0);
  const { data: posts } = useQuery({
    queryKey: ["posts", "address", address],
    queryFn: () => fetchProfilePosts(address as string),
    enabled: !!address,
  });

  return (
    <div>
      <ProfileCard />
      <StickyTabBar>
        <TabLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
          Submitted
        </TabLink>
        <TabLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
          Upvotes
        </TabLink>
      </StickyTabBar>

      <PostList posts={posts ?? []} sort="newest" />
    </div>
  );
}
