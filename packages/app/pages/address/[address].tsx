import {useRouter} from "next/router";

import {StickyTabBar, TabLink} from "@/components/TabBar";
import WalletAddress from "@/components/WalletAddress";
import {useStore} from "@/store/store";
import PostList from "@/components/PostList";

export const getServerSideProps = async ({
  params,
}: {
  params: {address: string};
}) => {
  const {address} = params;
  const isValid = address && address.length === 42;

  return {props: {isValid}};
};

export default function Address({isValid}: {isValid: boolean}) {
  const router = useRouter();
  const {address} = router.query;

  const {posts, sort} = useStore();

  if (!isValid) {
    return <div>Address not found.</div>;
  }

  // get posts submitted by user
  return (
    <div>
      <div>
        <WalletAddress address={address as string} />
      </div>
      <StickyTabBar>
        <TabLink active>Submissions</TabLink>
      </StickyTabBar>

      <PostList posts={posts} sort={sort} />
    </div>
  );
}
