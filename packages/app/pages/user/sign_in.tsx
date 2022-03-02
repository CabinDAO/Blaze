import { useConnect, useAccount } from "wagmi";
import { useRouter } from "next/router";
import { Button } from "@cabindao/topo";
import { styled } from "@/stitches.config";
import { useEffect } from "react";
import { useStore } from "@/store/store";
import { useCallback } from "react";
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
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
  
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const handleSIWE = useCallback(async () => {
    try {
      const res = await connect(connector); // connect from useConnect
      if (!res.data) throw res.error ?? new Error('Something went wrong')
    
      const nonceRes = await fetch('/api/nonce')
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.data.account,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: res.data.chain?.id,
        nonce: await nonceRes.text(),
      })
    
      const signer = await connector.getSigner()
      const signature = await signer.signMessage(message.prepareMessage())
    
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) throw new Error('Error verifying message')
    
      // It worked! User is signed in with Ethereum
    } catch (error) {
      // Do something with the error
    }
  }, [connector]));

  useEffect(() => {
    if (connected) {
      router.push("/");
    }
  }, [connected, router]);

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
