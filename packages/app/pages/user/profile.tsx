import PostList from "@/components/PostList";
import ProfileCard from "@/components/Profile";
import { StickyTabBar, TabLink } from "@/components/TabBar";
import { useWallet } from "@/components/WalletAuth";
import supabase from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useStore, Profile as ProfileType } from "@/store/store";
import { v4 as uuidv4 } from "uuid";
import { getUnixTime } from "date-fns";

interface Post {
  _id: string;
  id: string;
  title: string;
  url: string;
  postedBy: string;
  upvotes: number;
  created_at: string;
  domainText: string;
}

async function fetchProfilePosts(address: string) {
  let { data: posts, error: postsError } = await supabase
    .from<Post>("Posts")
    .select("*")
    .filter("postedBy", "eq", address)
    .order("created_at", { ascending: false })
    .order("_id", { ascending: true })
    .limit(25);
  return posts;
}

export default function Profile() {
  const { loadProfileIntoStore, setSiweAddress, setSiweLoading } = useStore();
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState(0);
  const { data: posts } = useQuery({
    queryKey: ["posts", "address", address],
    queryFn: () => fetchProfilePosts(address as string),
    enabled: !!address,
  });
  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch("/api/me");
        const json = await res.json();
        setSiweAddress(json.address);
      } finally {
        setSiweLoading(false);
      }
    };
    // 1. page loads
    (async () => await handler())();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [setSiweAddress, setSiweLoading]);

  useEffect(() => {
    const checkProfileExistence = async (walletAddress: string) => {
      const { data, error } = await supabase
        .from<ProfileType>("Profiles")
        .select("*")
        .eq("walletAddress", walletAddress)
        .limit(1)
        .single();
      if (data === null) {
        const profile: ProfileType = {
          _id: uuidv4(),
          walletAddress,
          joinDate: getUnixTime(new Date()),
          lastSeenDate: getUnixTime(new Date()),
          upvotesReceived: 0,
          postsUpvoted: 0,
        };
        await supabase.from("Profiles").insert(profile);
        loadProfileIntoStore(profile);
      } else {
        const { data: profile } = await supabase
          .from<ProfileType>("Profiles")
          .update({ lastSeenDate: getUnixTime(new Date()) })
          .eq("walletAddress", walletAddress)
          .limit(1)
          .single();
        if (profile === null) {
          console.log("Error: ", error);
        } else {
          loadProfileIntoStore(profile);
        }
      }
    };
    if (address) {
      checkProfileExistence(address);
    }
  }, [address, loadProfileIntoStore]);

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

      <PostList posts={posts ?? []} />
    </div>
  );
}
