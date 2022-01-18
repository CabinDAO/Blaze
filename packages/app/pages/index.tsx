import type { NextPage } from "next";
import { styled } from "@/stitches.config";
import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import Post from "@/components/Post";
import { useWallet } from "@/components/WalletAuth";
import Select from "@/components/Select";

const Title = styled("h2", {
  marginTop: "$12",
  marginBottom: "$5",
});

const TabBarWrapper = styled("div", {
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderColor: "$forest",
  boxSizing: "border-box",
  marginBottom: "$2",
});
const TabBarContent = styled("div", {
  display: "flex",
  marginBottom: -1,
});
const TabLink = styled("button", {
  boxSizing: "border-box",
  background: "none",
  paddingLeft: "$4",
  paddingRight: "$4",
  border: 0,
  cursor: "pointer",
  defaultVariants: {
    active: false,
  },
  variants: {
    active: {
      false: {
        "&:hover": {
          backgroundColor: "rgba(50, 72, 65, 0.1)",
        },
      },
      true: {
        backgroundColor: "$forest",
        color: "$sand",
      },
    },
  },
});
const TabButton = (props: any) => <TabLink {...props} />;
const TabBar = ({ children, ...props }: { children?: React.ReactNode }) => (
  <TabBarWrapper {...props}>
    <TabBarContent>{children}</TabBarContent>
  </TabBarWrapper>
);

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
          <TabButton active>Submissions</TabButton>
          <TabButton>Upvoted</TabButton>
          <div style={{ marginLeft: "auto" }}>
            <Select options={[{ text: "Newest", value: "Newest" }, {text: "Trending", value: "Trending"}]} />
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
