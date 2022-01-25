import type { NextPage } from "next";
import { useState } from "react";
import { styled } from "@/stitches.config";
import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import PostList from "@/components/PostList";
import { useWallet } from "@/components/WalletAuth";
import { Select } from "@cabindao/topo";
import { useStore } from "@/store/store";
import AppState, { Sort } from "@/types";


const Title = styled("h2", {
  marginTop: "$12",
  marginBottom: "$5",
  '&:last-of-type': {
    marginTop: 0,
  }
});

const TabBarWrapper = styled("div", {
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderColor: "$forest",
  boxSizing: "border-box",
  marginBottom: "$2",
});
Select.toString = () => ".select";
const TabBarContent = styled("div", {
  display: "flex",
  marginBottom: -1,
  alignItems: "flex-end",
});
const TabLink = styled("button", {
  boxSizing: "border-box",
  height: "$10",
  background: "none",
  paddingLeft: "$4",
  paddingRight: "$4",
  border: 0,
  cursor: "pointer",
  zIndex: 1,
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
const TabBar = ({ children, ...props }: { children?: React.ReactNode }) => {
  return(<TabBarWrapper {...props}>
    <TabBarContent {...props}>{children}</TabBarContent>
  </TabBarWrapper>)
};

const Home: NextPage = () => {
  const { address, ens } = useWallet();
  const { posts, sort, updateSort } = useStore();
  const [activeTab, setActiveTab] = useState(0);
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
          {!address && (
            <TabButton
              active={activeTab == 0 ? true : false}
              onClick={() => setActiveTab(0)}
            >
              Links
            </TabButton>
          )}
          {address && (
            <>
              <TabButton
                active={activeTab == 0 ? true : false}
                onClick={() => setActiveTab(0)}
              >
                Links
              </TabButton>  
              <TabButton
                active={activeTab == 1 ? true : false}
                onClick={() => setActiveTab(1)}
              >
                Submissions
              </TabButton>
              <TabButton
                active={activeTab == 2 ? true : false}
                onClick={() => setActiveTab(2)}
              >
                Upvotes
              </TabButton>
            </>
          )}

          <div
            style={{
              marginLeft: "auto",
            }}
          >
            <Select
              disabled={false}
              options={[
                { key: "newest", label: "Newest" },
                { key: "trending", label: "Trending" },
                { key: "controversial", label: "Controversial" },
              ]}
              value={"newest"}
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
