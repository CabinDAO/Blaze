import type { NextPage } from "next";
import { useState, useEffect } from "react";
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
  "&:last-of-type": {
    marginTop: 0,
  },
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
  return (
    <TabBarWrapper {...props}>
      <TabBarContent {...props}>{children}</TabBarContent>
    </TabBarWrapper>
  );
};
const StickyTabBar = styled(TabBar, {
  backgroundColor: "$sand",
  variants: {
    position: {
      fixed: {
        position: "static",
      },
      sticky: {
        position: "sticky",
        top: 0,
        left: 0,
      }
    }
  }
});
const Home: NextPage = () => {
  const { address, ens } = useWallet();
  const { posts, sort, updateSort } = useStore();
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
  });
  return (
    <div>
        {address && (
          <>
            <Title>Profile</Title>
            <Card>
              <UserCard address={address} ens={ens} />
            </Card>
          </>
        )}
        <Title>Today</Title>
        <StickyTabBar position={scrolled ? "sticky" : "fixed"}>
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
              <TabButton
                active={activeTab == 3 ? true : false}
                onClick={() => setActiveTab(3)}
              >
                Comments
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
        </StickyTabBar>
      <PostList posts={posts} sort={sort} />
    </div>
  );
};

export default Home;
