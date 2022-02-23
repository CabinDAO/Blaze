import type {NextPage} from "next";
import {useState, useEffect, useMemo} from "react";
import PostList from "@/components/PostList";
import {useStore} from "@/store/store";
import Title from "@/components/Title";
import StickyTabBar from "@/components/TabBar";

const Home: NextPage = () => {
  const {posts, sort} = useStore();

  return (
    <div>
      {/* <Profile /> */}
      <Title>Today</Title>
      <StickyTabBar />
      <PostList posts={posts} sort={sort} />
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const initSupabaseClient = async () => {
    const {createClient} = await import("@supabase/supabase-js");
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
  let {data: posts, error: postsError} = await supabase
    .from("Posts")
    .select("*");
  if (posts === null) {
    console.log(postsError);
    posts = [];
  }
  let {data: upvotes, error: upvotesError} = await supabase
    .from("Upvotes")
    .select("*");
  if (upvotes === null) {
    console.log(upvotesError);
    upvotes = [];
  }
  return {
    props: {
      initialZustandState: {
        posts,
        upvotes,
      },
    },
    revalidate: 10,
  };
}
