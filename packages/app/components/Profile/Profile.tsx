import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import {useWallet} from "@/components/WalletAuth";
import Title from "@/components/Title";
import {useStore} from "@/store/store";


const Profile = () => {
  const { currentProfile} = useStore();
  const {address, ens} = useWallet({fetchEns: true});
  return (
    <>
      {address && currentProfile && (
        <>
          <Title>Profile</Title>
          <Card>
            <UserCard
              address={address}
              ens={ens}
              joinDate={currentProfile.joinDate}
              lastSeenDate={currentProfile.lastSeenDate}
              upvotesReceived={currentProfile.upvotesReceived}
              linksUpvoted={currentProfile.postsUpvoted}
            />
          </Card>
        </>
      )}
    </>
  );
};

export default Profile;
