import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import { useWallet } from "@/components/WalletAuth";
import Title from "@/components/Title";
import { useStore } from "@/store/store";
import { useEnsLookup } from "@/helpers/ens";

const Profile = () => {
  const { currentProfile } = useStore();
  const { address } = useWallet({ fetchEns: true });
  const ensLookup = useEnsLookup(address);
  return (
    <>
      {address && currentProfile && (
        <>
          <Title>Profile</Title>
          <Card>
            <UserCard
              address={address}
              ens={{ name: ensLookup[address] }}
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
