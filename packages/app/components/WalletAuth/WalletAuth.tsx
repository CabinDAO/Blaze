import React, {createContext, useContext, useMemo, useState} from "react";
import {Button} from "@cabindao/topo";
import WalletAddress from "../WalletAddress";
import {useConnect, useAccount, Connector} from "wagmi";
import Link from "next/link";
import {useRouter} from "next/router";

// interface WalletContextState {
//   address: string | null;
//   setAddress: (address: string | null) => void;
// }
// const WalletContext = createContext<WalletContextState>({
//   address: null,
//   setAddress: () => {},
// });

// export const WalletProvider = ({
//   children,
// }: {
//   children?: React.ReactNode;
// }) => {
//   const [address, setAddress] = useState<string | null>(null);
//   const value = useMemo(() => ({ address, setAddress }), [address, setAddress]);
//   return (
//     <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
//   );
// };

export const useWallet = (options?: {fetchEns?: boolean}) => {
  const [{data, error}] = useAccount(options);
  return {
    isConnected: !error && !!data?.address,
    address: data?.address ?? null,
    ens: data?.ens ?? null,
  };
};

const WalletAuth = () => {
  const router = useRouter();
  const [{data, error, loading}, connect] = useConnect();

  const [
    {data: accountData, error: accountError, loading: accountLoading},
    disconnect,
  ] = useAccount();
  if (data.connected) {
    return (
      <div>
        <Button onClick={disconnect} type="secondary" tone="forest">
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
