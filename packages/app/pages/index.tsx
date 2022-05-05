import PostList from "@/components/PostList";
import { useStore } from "@/store/store";
import Title from "@/components/Title";
import StickyTabBar from "@/components/TabBar";
import { useQuery, useQueryClient } from "react-query";
import { loadPosts, Post, PostRanking } from "@/helpers/posts";
import { GetServerSideProps } from "next";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/constants";
import { useSiweSession } from "@/helpers/siwe";

interface HomeProps {
  initialAddress: string | null;
  initialPosts: Post[] | PostRanking[] | null;
  initialSort: string;
}
const Home = ({ initialPosts, initialAddress, initialSort }: HomeProps) => {
  const { sort } = useStore();
  const { address, loading } = useSiweSession();

  const { data: posts, status } = useQuery(
    ["posts", sort, address],
    () => loadPosts(sort, address),
    {
      enabled: !loading,
      initialData: () => {
        if (sort === initialSort && (address ?? null) === initialAddress) {
          return initialPosts;
        }
      },
    }
  );

  return (
    <div>
      <Title>Today</Title>
      <StickyTabBar />
      <PostList loading={status === "loading"} posts={posts ?? []} />
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const sort = "trending";
    const address = req.session.siwe?.address ?? null;
    const posts = await loadPosts(sort, address);
    return {
      props: {
        initialPosts: posts,
        initialSort: sort,
        initialAddress: address,
        initialZustandState: {
          siwe: {
            address: address,
          },
          sort,
        },
      },
    };
  },
  ironOptions
);
