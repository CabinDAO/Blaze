import {
  useConnect,
  Connector,
} from "wagmi";
import { useRouter } from "next/router";
import { Button } from "@cabindao/topo";
import { styled } from "@/stitches.config";
import { useEffect } from "react";
import { useCallback } from "react";
import { SiweMessage } from "siwe";
import { v4 as uuidv4 } from "uuid";
import { useStore, Profile } from "@/store/store";
import supabase from "@/lib/supabase";
import { getUnixTime } from "date-fns";

const ConnectList = styled("div", {
  display: "flex",
  flexDirection: "column",
  maxWidth: 250,
  gap: "$2",
  margin: "25% auto",
});

const SignIn = () => {
  const router = useRouter();
  const [{ data, error, loading }, connect] = useConnect();
  const { connected, connector } = data;
  const {
    siwe,
    setSiweLoading,
    setSiweError,
    setSiweAddress,
    loadProfileIntoStore,
  } = useStore();


  const signIn = useCallback(async (connector: Connector) => {
    try {

      setSiweLoading(true);
      setSiweError(undefined);

      const res = await connect(connector);
      if(!res.data) throw res.error ?? new Error("Error connecting wallet. See console for details.");

      // Fetch random nonce, create SIWE message, and sign with wallet
      const nonceRes = await fetch("/api/nonce");
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.data?.account,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: res.data.chain?.id,
        nonce: await nonceRes.text(),
      });
      const signer = await connector.getSigner();
      const signature = await signer.signMessage(message.prepareMessage());

      // Verify signature
      const verifyRes = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, signature}),
      });
      if (!verifyRes.ok) throw new Error("Error verifying message");
      setSiweAddress(res.data?.account);
      setSiweLoading(false);
    } catch (error: any) {
      setSiweError(error);
      setSiweLoading(false);
    }
  }, [
    setSiweAddress,
    setSiweError,
    setSiweLoading,
  ]);

  useEffect(() => {
    if (siwe.address) {
      router.push("/");
    }
  }, [siwe.address, router]);

  useEffect(() => {
    const checkProfileExistence = async (walletAddress: string) => {
      const { data, error } = await supabase
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
        const { data: profile } = await supabase
          .from<Profile>("Profiles")
          .update({ lastSeenDate: getUnixTime(new Date()) })
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
      checkProfileExistence(siwe.address);
    }
  }, [siwe.address, loadProfileIntoStore]);

  return (
      <ConnectList>
        {data.connectors.map((x) => (
          <Button disabled={siwe.loading} key={x.id} onClick={async () => await signIn(x)}>
            {x.name}
            {!x.ready && " (unsupported)"}
          </Button>
        ))}
      </ConnectList>
    );
};

export default SignIn;
