import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import { useWallet } from "@/components/WalletAuth";
import Title from "@/components/Title";
import { v4 as uuidv4 } from "uuid";
import { useStore, Profile } from "@/store/store";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { getUnixTime } from "date-fns";

const Profile = () => {
  const { loadProfileIntoStore, currentProfile } = useStore();
  const { address, ens } = useWallet({ fetchEns: true });

  useEffect(() => {
    const checkProfileExistance = async (walletAddress: string) => {
      const { data, error } = await supabase.from<Profile>("Profiles").select().eq("walletAddress", address).limit(1).single();
      if (data === null) {
        const profile: Profile = {
          _id: uuidv4(),
          walletAddress,
          joinDate: getUnixTime(new Date()),
          lastSeenDate: getUnixTime(new Date()),
          upvotesReceived: 0,
          postsUpvoted: 0,
        };
        await supabase.from("Profiles").insert(profile);
        loadProfileIntoStore(profile);
      } else {
        const { data: profile } = await supabase.from<Profile>("Profiles").update({ lastSeenDate: getUnixTime(new Date()) }).eq("walletAddress", walletAddress).limit(1).single();

        loadProfileIntoStore(profile);
      }
    };
    if (address) {
      checkProfileExistance(address);
    };
  }, [address, loadProfileIntoStore]);
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
