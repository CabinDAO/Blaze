import { useConnect, useAccount } from "wagmi";
import { useRouter } from "next/router";
import { Button } from "@cabindao/topo";
import { styled } from "@/stitches.config";
import { useEffect } from "react";
import {v4 as uuidv4} from 'uuid';

import { auth, setupThreadClient, createInstance, createQuery, updateLastSeenTime} from "@/lib/db";
import { ThreadID, Where } from "@textile/hub";
import { getUnixTime } from "date-fns";
import { useStore } from "@/store/store"

const IdString = process.env.THREAD_ID || "";

const ConnectList = styled("div", {
  display: "flex",
  flexDirection: "column",
  maxWidth: 250,
  gap: "$2",
  margin: "25% auto"
});

const SignIn = () => {
  const { loadProfile } = useStore();
  const router = useRouter();
  const [{data: accountData}, disconnect] = useAccount();
  const [{ data, error, loading }, connect] = useConnect();
  const { connected } = data;

  useEffect(() => {
    const checkProfileExistance = async (walletAddress) => {
      const threadId = ThreadID.fromString(IdString);
      const userAuth = await auth({ key: process.env.API_KEY || "", secret: process.env.API_SECRET || "" });
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
        })
      } else {
       const profile = await updateLastSeenTime(client, threadId, walletAddress);
      }
      loadProfile(profile);
    }
    if (connected) {
      checkProfileExistance(accountData.address);
      router.push("/");
    }
  }, [connected, router, accountData.address]);

  return (
    <ConnectList>
      {data.connectors.map((x) => (
        <Button disabled={!x.ready} key={x.id} onClick={() => connect(x)}>
          {x.name}
          {!x.ready && " (unsupported)"}
        </Button>
      ))}
    </ConnectList>
  );
};

export default SignIn;
