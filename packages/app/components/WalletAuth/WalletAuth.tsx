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
  const { siwe } = useStore();

  const [{data: ensData}] = useEnsLookup({
    address: siwe?.address,
    skip: !!ens || !siwe?.address || !options?.fetchEns,
  });

  useEffect(() => {
    if (!ens && options?.fetchEns && ensData) {
      setEns(ensData);
    }
  }, [ens, options?.fetchEns, ensData, setEns]);

  return {
    isConnected: !siwe.error && !!siwe?.address,
    address: siwe?.address ?? null,
    ens: {
      name: ens,
      avatar: null,
    },
  };
};

const WalletAuth = () => {
  const router = useRouter();
  const [, disconnect] = useAccount();
  const { siwe, clearSiweSession } = useStore();
  const SignOutHandler = async () => {
    await fetch('/api/logout');
    clearSiweSession();
    disconnect();
    router.push('/');
  }
  if (siwe.address) {
    return (
      <div>
        <Button onClick={async () => await SignOutHandler()} type="secondary" tone="forest">
          Sign Out
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
