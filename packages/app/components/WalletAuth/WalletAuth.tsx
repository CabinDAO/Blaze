import React, { createContext, useContext, useMemo, useState } from "react";
import { Button } from "@cabindao/topo";
import WalletAddress from "../WalletAddress";

interface WalletContextState {
  address: string | null;
  setAddress: (address: string | null) => void;
  isConnected: boolean;
}
const WalletContext = createContext<WalletContextState>({
  address: null,
  setAddress: () => {},
  isConnected: false,
});

export const WalletProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [address, setAddress] = useState<string | null>(null);
  const value = useMemo(
    () => ({ address, setAddress, isConnected: !!address }),
    [address, setAddress]
  );
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export const useWallet = () => {
  return useContext(WalletContext);
};

const WalletAuth = () => {
  const { address, setAddress } = useContext(WalletContext);
  if (address) {
    return (
      <div>
        <Button onClick={() => setAddress(null)} type="secondary">
          Disconnect
        </Button>
      </div>
    );
  }
  return (
    <Button
      onClick={() => setAddress("0x0000000000000000000000000000000000000000")}
    >
      connect
    </Button>
  );
};

export default WalletAuth;
