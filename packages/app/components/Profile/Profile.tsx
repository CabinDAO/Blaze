import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import { useWallet } from "@/components/WalletAuth";
import Title from "@/components/Title";
import { v4 as uuidv4 } from "uuid";
import {
  auth,
  setupThreadClient,
  createInstance,
  createQuery,
  updateLastSeenTime,
} from "@/lib/db";
import { ThreadID, Query, Where } from "@textile/hub";
import { getUnixTime } from "date-fns";
import { useStore, Profile } from "@/store/store";
import { useEffect } from "react";
import WalletAddress from "../WalletAddress";


const Profile = () => {
  const { loadProfileIntoStore, currentProfile } = useStore();
  const { joinDate, lastSeenDate, upvotesReceived, linksUpvoted } =
    currentProfile;
  const { address, ens } = useWallet({ fetchEns: true });

  useEffect(() => {
    const checkProfileExistance = async (walletAddress: string) => {
      const userAuth = await auth({
        key: process.env.NEXT_PUBLIC_TEXTILE_API_KEY || "",
        secret: process.env.NEXT_PUBLIC_TEXTILE_API_SECRET || "",
      });
      const client = await setupThreadClient(userAuth);
      const threadList = await client.listDBs();
      const threadId = ThreadID.fromString(threadList[0].id);
      const query = new Where("walletAddress").eq(walletAddress);
      const result = await createQuery(client, "profiles", threadId, query);
      if (result.length === 0) {
        const profile: Profile = {
          _id: uuidv4(),
          walletAddress,
          joinDate: getUnixTime(new Date()),
          lastSeenDate: getUnixTime(new Date()),
          upvotesReceived: 0,
          linksUpvoted: 0,
        };
        await createInstance(client, threadId, "profiles", [profile]);
        loadProfileIntoStore(profile);
      } else {
        const profile = await updateLastSeenTime(
          client,
          threadId,
          walletAddress
        );
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
