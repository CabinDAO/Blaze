import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import { useWallet } from "@/components/WalletAuth";
import Title from "@/components/Title";
import { v4 as uuidv4 } from "uuid";
import { useStore, Profile } from "@/store/store";
import { useEffect } from "react";
import supabase from "@/lib/supabaseClient";


const Profile = () => {
  const { loadProfileIntoStore, currentProfile } = useStore();
  const { joinDate, lastSeenDate, upvotesReceived, linksUpvoted } =
    currentProfile;
  const { address, ens } = useWallet({ fetchEns: true });

  useEffect(() => {
    const checkProfileExistance = async (walletAddress: string) => {
      const result = supabase.from("Profile").select().eq("walletAddress", address);
      if (!result) {
        const profile: Profile = {
          _id: uuidv4(),
          walletAddress,
          joinDate: new Date(),
          lastSeenDate: new Date(),
          upvotesReceived: 0,
          linksUpvoted: 0,
        };
        await supabase.from("Profile").insert([profile]);
        loadProfileIntoStore(profile);
      } else {
        const {data : lastSeen , error} = await supabase.from("Profile").select("lastSeenDate").eq("walletAddress", walletAddress).limit(1).single();
        const {data : profile , error} = await supabase.from("Profile").update({lastSeenDate: new Date()}).match({lastSeenDate: lastSeen});
        loadProfileIntoStore(profile);
      }
    };
    if (address) {
      checkProfileExistance(address);
    }
  }, [address, loadProfileIntoStore]);
  return (
    <>
      {address && (
        <>
          <Title>Profile</Title>
          <Card>
            <UserCard
              address={address}
              ens={ens}
              joinDate={joinDate}
              lastSeenDate={lastSeenDate}
              upvotesReceived={upvotesReceived}
              linksUpvoted={linksUpvoted}
            />
          </Card>
        </>
      )}
    </>
  );
};

export default Profile;
