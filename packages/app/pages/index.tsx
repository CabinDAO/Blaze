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
  const { posts, sort, updateSort} = useStore();
  return (
    <div>
      <header>
        <Title>Today</Title>
        <TabBar>
          <TabButton active>Links</TabButton>
          <div style={{ marginLeft: "auto" }}>
            <Select
              disabled={false}
              options={[
                { key: "newest", label: "Newest" },
                { key: "trending", label: "Trending" },
                { key: "controversial", label: "Controversial" },
              ]}
              placeholder="Sort:"
              onChange={(key: Sort) => updateSort(key)}
            />
          </div>
        </TabBar>
        <PostList posts={posts} sort={sort} />
      </header>
    </div>
  );
};

export default Home;
