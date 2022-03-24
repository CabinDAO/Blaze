import { useMemo } from "react";

import { styled } from "@/stitches.config";
import { useEnsStore } from "@/helpers/ens";

const AddressText = styled("span", {
  fontFamily: "$mono",
  "&:hover": {
    textDecoration: "underline",
  },
});

export interface WalletAddressProps
  extends React.ComponentProps<typeof AddressText> {
  address: string;
  ens?: {
    name: string | null;
    avatar?: string | null;
  } | null;
}
const WalletAddress = ({ address, ens, ...props }: WalletAddressProps) => {
  const addr = useMemo(() => {
    return [address.slice(0, 6), address.slice(-4)].join("...");
  }, [address]);

  return (
    <AddressText title={address} {...props}>
      {ens?.name ?? addr}
    </AddressText>
  );
};

export default WalletAddress;
