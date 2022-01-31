import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { styled } from "@/stitches.config";
import PostList from "@/components/PostList";
import { useStore } from "@/store/store";
import AppState, { Sort } from "@/types";
import { setupThreadClient, auth } from "@/lib/db";
import { ThreadID } from "@textile/hub";
import ClientSide from "@/components/HOC/ClientSide";
import Title from "@/components/Title";
import Profile from "@/components/Profile";
import StickyTabBar from "@/components/TabBar/TabBar";

const Home: NextPage = () => {
  const { posts, sort } = useStore();
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
  });
  return (
    <ClientSide>
      <Profile/>
      <Title>Today</Title>
      <StickyTabBar position={scrolled ? "sticky" : "fixed"}/>
      <PostList posts={posts} sort={sort} />
    </ClientSide>
  );
};

export default Home;  

export async function getStaticProps() {
  const userAuth = await auth({
    key: process.env.API_KEY || "",
    secret: process.env.API_SECRET || "",
  });
  const client = await setupThreadClient(userAuth);
  const threadList = await client.listDBs();
  const threadId = ThreadID.fromString(threadList[0].id);
  const posts = await client.find(threadId, "links", {});
  return {
    props: {
      initialZustandState: {
        posts,
     }
    },
  };
}
