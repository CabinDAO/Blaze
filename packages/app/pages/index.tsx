import type { NextPage } from "next";
import { styled } from "@/stitches.config";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { Button, Heading, Input } from "@cabindao/topo";
import Post, { PostList } from "@/components/Post";
import { useWallet } from "@/components/WalletAuth";
import Title from "@/components/Title";
import TabBar, { TabButton } from "@/components/TabBar";

const MenuButton = (props: any) => {
  return (
    <Button
      css={{
        "&:hover": {
          backgroundColor: "rgba(50, 72, 65, 0.1)",
        },
      }}
      type="secondary"
      rightIcon={<ChevronDownIcon />}
      {...props}
    />
  );
};

const Home: NextPage = () => {
  const { address, ens } = useWallet();
  return (
    <div>
      <header>
        <Title>Today</Title>

        <TabBar>
          <TabButton active>Links</TabButton>
          <div style={{ marginLeft: "auto" }}>
            <MenuButton>Newest</MenuButton>
          </div>
        </TabBar>

        <PostList>
          <Post title="Post Title" />
          <Post title="Design with Community in Mind: Cabin Core Contributor Mel Shields" />
          <Post title="A brief history of decentralized cities and centralized states" />
          <Post title="ConstitutionDAO: We Lost the Battle, But Will Win the War" />
          <Post title="Growing the Writer’s Guild: Cabin Core Contributor Roxine Kee" />
          <Post title="Building a Decentralized City: Cabin Core Contributor Phil Levin" />
          <Post title="Around the Campfire, Cabin Contributor Jon Hillis" />
        </PostList>
      </header>
    </div>
  );
};

export default Home;
