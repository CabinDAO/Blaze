import { useConnect, useAccount, useNetwork, useSignMessage, Connector } from "wagmi";
import { useRouter } from "next/router";
import { Button } from "@cabindao/topo";
import { styled } from "@/stitches.config";
import { useEffect } from "react";
import { useCallback } from "react";
import { SiweMessage } from 'siwe';
import {v4 as uuidv4} from "uuid";
import {useStore, Profile} from "@/store/store";
import supabase from "@/lib/supabaseClient";
import {getUnixTime} from "date-fns";

const ConnectList = styled("div", {
  display: "flex",
  flexDirection: "column",
  maxWidth: 250,
  gap: "$2",
  margin: "25% auto"
});

const SignIn = () => {
  const router = useRouter();
  const [{ data, error, loading }, connect] = useConnect();
  const { connected, connector } = data;
  const { siwe, setSiweLoading, setSiweError, setSiweAddress, loadProfileIntoStore } = useStore();
  
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const [, signMessage] = useSignMessage();

  const signIn = useCallback(async () => {
    try {
      const address = accountData?.address
      const chainId = networkData?.chain?.id
      if (!address || !chainId) return

      setSiweLoading(true);
      setSiweError(undefined);

      // Fetch random nonce, create SIWE message, and sign with wallet
      const nonceRes = await fetch('/api/nonce')
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: await nonceRes.text(),
      })
      const signRes = await signMessage({ message: message.prepareMessage() })
      if (signRes.error) throw signRes.error

      // Verify signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature: signRes.data }),
      })
      if (!verifyRes.ok) throw new Error('Error verifying message')
      setSiweAddress(address)
      setSiweLoading(false);
    } catch (error: any) {
      setSiweError(error);
      setSiweLoading(false);
    }
  }, [accountData?.address, networkData?.chain?.id, setSiweAddress, setSiweError, setSiweLoading, signMessage]); 
  
  useEffect(() => {
    if (siwe.address) {
      router.push("/");
    }
  }, [siwe.address, router]);

  useEffect(() => {
    const checkProfileExistance = async (walletAddress: string) => {
      const {data, error} = await supabase
        .from<Profile>("Profiles")
        .select("*")
        .eq("walletAddress", walletAddress)
        .limit(1)
        .single();
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
        const {data: profile} = await supabase
          .from<Profile>("Profiles")
          .update({lastSeenDate: getUnixTime(new Date())})
          .eq("walletAddress", walletAddress)
          .limit(1)
          .single();
        if (profile === null) {
          console.log("Error: ", error);
        } else {
          loadProfileIntoStore(profile);
        }
      }
    };
    if (siwe.address) {
      checkProfileExistance(siwe.address);
    }
  }, [siwe.address, loadProfileIntoStore]);

  if (!connected){
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
  } else {
    return (
      <ConnectList>
        <Button disabled={siwe.loading} onClick={async () => signIn()}>Sign-In with Ethereum</Button>
      </ConnectList>
    );
  }

  
};

export default SignIn;
