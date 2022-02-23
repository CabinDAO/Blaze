import PostList from "@/components/PostList";
import ProfileCard from "@/components/Profile";
import {StickyTabBar, TabLink} from "@/components/TabBar";
import {useStore} from "@/store/store";
import {useState} from "react";

export default function Profile() {
  const {posts, sort} = useStore();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <ProfileCard />
      <StickyTabBar>
        <TabLink active={activeTab === 0} onClick={() => setActiveTab(0)}>
          Submitted
        </TabLink>
        <TabLink active={activeTab === 1} onClick={() => setActiveTab(1)}>
          Upvotes
        </TabLink>
      </StickyTabBar>

      <PostList posts={posts} sort={sort} />
    </div>
  );
}
