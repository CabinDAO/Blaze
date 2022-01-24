import type { NextPage } from "next";
import { styled } from "@/stitches.config";
import { useContext } from "react";
import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import PostList from "@/components/PostList";
import { useWallet } from "@/components/WalletAuth";
import { Select } from "@cabindao/topo";
import { useStore } from "@/store/store";
import AppState, {Sort} from "@/types";

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

const Home: NextPage = () => {
  const { address, ens } = useWallet();
  const { posts, sort, updateSort} = useStore();
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
