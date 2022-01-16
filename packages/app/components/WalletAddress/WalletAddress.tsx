import { useMemo } from "react";

import { styled } from "@/stitches.config";

const AddressText = styled("span", {
  fontFamily: "$mono",
});

export interface WalletAddressProps {
  address: string;
}
const WalletAddress = ({ address }: WalletAddressProps) => {
  const addr = useMemo(() => {
    return [address.slice(0, 6), address.slice(-4)].join("...");
  }, [address]);

  return <AddressText>{addr}</AddressText>;
};

export default WalletAddress;
