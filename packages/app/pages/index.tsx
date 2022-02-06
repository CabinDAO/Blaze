import type { NextPage } from "next";
import { useState, useEffect, useMemo } from "react";
import PostList from "@/components/PostList";
import { useWallet } from "@/components/WalletAuth";
import { useStore } from "@/store/store";
import Title from "@/components/Title";
import ClientSide from "@/components/HOC/ClientSide";
import Profile from "@/components/Profile";
import StickyTabBar from "@/components/TabBar";
import supabase from "@/lib/supabaseClient";

const Home: NextPage = () => {
  const { posts, sort } = useStore();
  const [activeTab, setActiveTab] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 200) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    }
  });
  return (
    <ClientSide>
      <Profile />
      <Title>Today</Title>
      <StickyTabBar position={scrolled ? "sticky" : "fixed"} />
      <PostList posts={posts} sort={sort} />
    </ClientSide>
  );
};

export default Home;

export async function getStaticProps() {
  let {data: posts} = await supabase.from("Posts").select('*');
  if (posts === null) {
    posts = [];
  } 
  let {data: upvotes} = await supabase.from("Upvotes").select('*');
  if (upvotes === null) {
    upvotes = [];
  }
  return {
    props: {
      initialZustandState: {
        posts,
        upvotes,
      }
    },
  };
}