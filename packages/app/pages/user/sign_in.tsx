import { useConnect, useAccount } from "wagmi";
import { useRouter } from "next/router";
import { Button } from "@cabindao/topo";
import { styled } from "@/stitches.config";
import { useEffect } from "react";
import { useStore } from "@/store/store";

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
  const { connected } = data;

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
