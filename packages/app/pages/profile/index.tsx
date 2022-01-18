import Card from "@/components/Card";
import Post, { PostList } from "@/components/Post";
import TabBar, { TabButton } from "@/components/TabBar";
import Title from "@/components/Title/Title";
import UserCard from "@/components/UserCard";
import { useWallet } from "@/components/WalletAuth";

const UnknownUser = () => {
  return (
    <div>
      <p>Connect your wallet to view your profile.</p>
    </div>
  );
};

const Profile = () => {
  const { address, ens } = useWallet();

  if (!address) {
    return <UnknownUser />;
  }

  return (
    <div>
      <Card>
        <Title>Profile</Title>
        <UserCard address={address} ens={ens} />
      </Card>

      <TabBar>
        <TabButton active>Links</TabButton>
        <div style={{ marginLeft: "auto" }}></div>
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
    </div>
  );
};

export default Profile;
