import type { NextPage } from "next";
import { styled } from "@/stitches.config";

import { Button, Heading, Input } from "@cabindao/topo";
import UserCard from "@/components/UserCard";
import Post from "@/components/Post";
import { useWallet } from "@/components/WalletAuth";

const Text = styled("h2", {
  marginTop: "$12",
  marginBottom: "$5",
});

const Card = styled("div", {
  margin: "0 auto",
  marginBottom: "$12",
  maxWidth: 320,
});

const TabBar = styled("div", {
  display: "flex",
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderColor: "$forest",
  boxSizing: "border-box",
  marginBottom: "$2",
});

const PostList = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: "$4",
});

const Home: NextPage = () => {
  const { address } = useWallet();
  return (
    <div>
      <header>
        {address && (
          <>
            <Text>Profile</Text>
            <Card>
              <UserCard address={address} />
            </Card>
          </>
        )}

        <TabBar>
          <Button>Submissions</Button>
          <Button tone="wheat">Upvoted</Button>
          <div style={{ marginLeft: "auto" }}></div>
          <Button type="secondary">Newest</Button>
        </TabBar>
        <PostList>
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </PostList>
      </header>
    </div>
  );
};

export default Home;
