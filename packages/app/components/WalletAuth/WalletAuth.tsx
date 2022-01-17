import React, { createContext, useContext, useMemo, useState } from "react";
import { Button } from "@cabindao/topo";
import WalletAddress from "../WalletAddress";
import { useConnect, useAccount, Connector } from 'wagmi';

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

// export const useWallet = () => {
//   return useContext(WalletContext);
// };

const WalletAuth = () => {
  // const { address, setAddress } = useContext(WalletContext);
  const [{ data, error, loading }, connect] = useConnect()
  const [{data: accountData, error: accountError, loading: accountLoading }, disconnect] = useAccount();
  if (data) {
    return (
      <div>
        <Button onClick={disconnect} type="secondary">
          Disconnect
        </Button>
      </div>
    );
  }
  return (
    <Button
      onClick={() => connect(data.connectors[0])}
    >
      Connect
    </Button>
  );
};

export default WalletAuth;
