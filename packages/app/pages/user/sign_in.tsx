import { useConnect, useAccount, useNetwork, useSignMessage, Connector } from "wagmi";
import { useRouter } from "next/router";
import { Button } from "@cabindao/topo";
import { styled } from "@/stitches.config";
import { useEffect } from "react";
import { useStore } from "@/store/store";
import { useCallback } from "react";
import { SiweMessage } from 'siwe';

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
  const { siwe, setSiweLoading, setSiweError, setSiweAddress } = useStore();
  
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
  }, [])

  //To-Do: Figure out where this code should live


  useEffect(() => {
    if (siwe.address) {
      router.push("/");
    }
  }, [siwe.address, router]);
  
  return (
    <ConnectList>
      {data.connectors.map((x) => (
        <Button disabled={!x.ready} key={x.id} onClick={() => connect(x)}>
          {x.name}
          {!x.ready && " (unsupported)"}
        </Button>
      ))}
      {connected && <Button disabled={siwe.loading} onClick={() => signIn()}>Sign-In with Ethereum</Button>}
    </ConnectList>
  );
};

export default SignIn;
