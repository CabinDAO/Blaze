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
import { ThreadID, Where } from "@textile/hub";
import { getUnixTime } from "date-fns";
import { useStore } from "@/store/store";
import { useEffect } from 'react';





const Profile = () => {
  const IdString = process.env.THREAD_ID || "";
  const { loadProfileIntoStore, currentProfile } = useStore();
  const { joinedDate, lastSeenDate, upvotesReceived, linksUpvoted } = currentProfile;
  const { address, ens } = useWallet({ fetchEns: true });

  useEffect(() => {
        const checkProfileExistance = async (walletAddress) => {
          const threadId = ThreadID.fromString(IdString);
          const userAuth = await auth({
            key: process.env.API_KEY || "",
            secret: process.env.API_SECRET || "",
          });
          const client = await setupThreadClient(userAuth);
          const query = new Where("walletAddress").eq(walletAddress);
          const result = await createQuery(client, "profiles", threadId, query);
          if (result.length === 0) {
            const profile = await createInstance(client, threadId, "profiles", {
              _id: uuidv4(),
              walletAddress,
              joinDate: getUnixTime(new Date()),
              lastseen: getUnixTime(new Date()),
              upvotesReceived: 0,
              linksUpvoted: 0,
            });
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
        checkProfileExistance(address); 
  }, [address]);
  return (
    <>
      {address && (
        <>
          <Title>Profile</Title>
          <Card>
            <UserCard address={address} ens={ens} joinedDate={joinedDate} lastSeenDate={lastSeenDate} upvotesReceived={upvotesReceived}linksUpvoted={linksUpvoted} />
          </Card>
        </>
      )}
    </>
  );
  ;
};

export default Profile;
