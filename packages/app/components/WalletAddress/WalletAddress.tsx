import { useMemo } from "react";

import { styled } from "@/stitches.config";

const AddressText = styled("span", {
  fontFamily: "$mono",
});

export interface WalletAddressProps {
  address: string;
  ens?: {
    name: string;
    avatar?: string | null;
  } | null;
}
const WalletAddress = ({ address, ens }: WalletAddressProps) => {
  const addr = useMemo(() => {
    return [address.slice(0, 6), address.slice(-4)].join("...");
  }, [address]);

  return <AddressText title={address}>{ens?.name ?? addr}</AddressText>;
};

export default WalletAddress;
