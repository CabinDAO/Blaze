import type { NextPage } from "next";
import { styled } from "@/stitches.config";

import { Button, Heading, Input } from "@cabindao/topo";
import UserCard from "@/components/UserCard";
import Post from "@/components/Post";
import { useWallet } from "@/components/WalletAuth";

const Title = styled("h2", {
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
  const { address, ens } = useWallet();
  return (
    <div>
      <header>
        {address && (
          <>
            <Title>Profile</Title>
            <Card>
              <UserCard address={address} ens={ens} />
            </Card>
          </>
        )}

        <Title>Today</Title>

        <TabBar>
          <Button>Submissions</Button>
          <Button tone="wheat">Upvoted</Button>
          <div style={{ marginLeft: "auto" }}></div>
          <Button type="secondary">Newest</Button>
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
