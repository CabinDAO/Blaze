import React, {useEffect} from "react";
import {Button} from "@cabindao/topo";
import {useConnect, useAccount, Connector, useEnsLookup} from "wagmi";
import Link from "next/link";
import {useRouter} from "next/router";
import {useStore} from "@/store/store";
import create from "zustand";

interface AccountStore {
  ens: string | null;
  setEns(ens: string | null): void;
}
const useAccountInfo = create<AccountStore>((set) => ({
  ens: null,
  setEns: (ens: string) => set({ens}),
}));

export const useWallet = (options?: {fetchEns?: boolean}) => {
  const {ens, setEns} = useAccountInfo();
  const [{data, error}] = useAccount();

  const [{data: ensData}] = useEnsLookup({
    address: data?.address,
    skip: !!ens || !data?.address || !options?.fetchEns,
  });

  useEffect(() => {
    if (!ens && options?.fetchEns && ensData) {
      setEns(ensData);
    }
  }, [ens, options?.fetchEns, ensData, setEns]);

  return {
    isConnected: !error && !!data?.address,
    address: data?.address ?? null,
    ens: {
      name: ens,
      avatar: null,
    },
  };
};

const WalletAuth = () => {
  const router = useRouter();
  const [{data, error, loading}, connect] = useConnect();

  const [
    {data: accountData, error: accountError, loading: accountLoading},
    disconnect,
  ] = useAccount();
  const disconnectHandler = async () => {
    await disconnect();
  };
  if (data.connected) {
    return (
      <div>
        <Button onClick={disconnectHandler} type="secondary" tone="forest">
          Disconnect
        </Button>
      </div>
    );
  }

  if (router.pathname === "/user/sign_in") {
    return null;
  }
  return (
    <Link href="/user/sign_in" passHref>
      <a>
        <Button type="secondary">Connect</Button>
      </a>
    </Link>
  );
};

export default WalletAuth;
