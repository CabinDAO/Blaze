import type { NextPage } from "next";
import PostList from "@/components/PostList";
import { useStore } from "@/store/store";
import Title from "@/components/Title";
import StickyTabBar from "@/components/TabBar";
import { useQuery } from "react-query";
import supabase from "@/lib/supabase";
import { useEffect, useMemo } from "react";

import { useContract, useProvider } from "wagmi";
import { useEnsLookup } from "@/helpers/ens";

const sorting: Record<string, { column: string; ascending: boolean }> = {
  newest: {
    column: "created_at",
    ascending: false,
  },
  trending: {
    column: "score",
    ascending: false,
  },
};

async function loadPosts(sort: string, address?: string | null) {
  let limit = 25;
  let query = address
    ? supabase.rpc("user_posts_ranking", { address }).select("*").limit(limit)
    : supabase.from("post_rankings").select("*").limit(limit);

  if (sorting[sort]) {
    query = query
      .order(sorting[sort].column, {
        ascending: sorting[sort].ascending,
      })
      .order("_id", { ascending: true });
  }
  const { data: posts } = await query;
  return posts;
}

const Home: NextPage = () => {
  const {
    sort,
    setSiweAddress,
    setSiweLoading,
    siwe: { address },
  } = useStore();
  const { data: posts } = useQuery(["posts", sort, address], () =>
    loadPosts(sort, address)
  );
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

  const provider = useProvider();

  const addresses: string[] = useMemo(
    () => posts?.map((p) => p.postedBy as string) ?? [],
    [posts]
  );

  // prefetch ens names
  useEnsLookup(addresses, provider);

  return (
    <div>
      <Title>Today</Title>
      <StickyTabBar />
      <PostList posts={posts ?? []} />
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const initSupabaseClient = async () => {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseId = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabase = createClient(supabaseUrl, supabaseId, {
      schema: "public",
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    });
    return supabase;
  };
  const supabase = await initSupabaseClient();
  let { data: upvotes, error: upvotesError } = await supabase
    .from("Upvotes")
    .select("*");
  if (upvotes === null) {
    console.log(upvotesError);
    upvotes = [];
  }
  return {
    props: {
      initialZustandState: {
        upvotes,
      },
    },
    revalidate: 10,
  };
}
