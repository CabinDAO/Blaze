import type { NextPage } from "next";
import { styled } from "@/stitches.config";
import { useContext } from "react";
import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import PostList from "@/components/PostList";
import { useWallet } from "@/components/WalletAuth";
import DropdownMenu from "@/components/DropdownMenu";
import PostListProps from "@/types";
import SortCtx, { SortProvider } from "@/context/SortContext";

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

const dummyData: PostListProps = {
  posts: [
    {
      title:
        "Design with Community in Mind: Cabin Core Contributor Mel Shields",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 6,
      numberOfComments: 5,
      numberOfUpVotes: 10,
    },
    {
      title: "A brief history of decentralized cities and centralized states",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 5,
      numberOfComments: 0,
      numberOfUpVotes: 0,
    },
    {
      title: "ConstitutionDAO: We Lost the Battle, But Will Win the War",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 4,
      numberOfComments: 27,
      numberOfUpVotes: 100,
    },
    {
      title: "Growing the Writer’s Guild: Cabin Core Contributor Roxine Kee",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 3,
      numberOfComments: 9,
    },
    {
      title: "Building a Decentralized City: Cabin Core Contributor Phil Levin",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 2,
      numberOfComments: 13,
      numberOfUpVotes: 376,
    },
    {
      title: "Around the Campfire, Cabin Contributor Jon Hillis",
      domainText: "www.cabincreators.com",
      url: "www.creatorcabins.com",
      walletAddress: "0x0000000000000000000000000000000000000000",
      submissionDate: 1,
      numberOfComments: 43,
    },
  ],
};

const Home: NextPage = () => {
  const { address, ens } = useWallet();
  const { sortType } = useContext(SortCtx);
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

        <SortProvider>
          <TabBar>
            <TabButton active>Submissions</TabButton>
            <TabButton>Upvoted</TabButton>
            <div style={{ marginLeft: "auto" }}>
              <DropdownMenu options={[{text: "Newest", value:"newest"},{text: "Trending", value: "trending"}]}/>
            </div>
          </TabBar>
          <PostList posts={dummyData.posts} sort={sortType.value}/>
        </SortProvider>
      </header>
    </div>
  );
};

export default Home;
