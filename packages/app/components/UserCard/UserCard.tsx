import { ExternalLinkIcon, CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { styled } from "@/stitches.config";
import WalletAddress from "../WalletAddress";

const AddressHeader = styled("div", {
  display: "flex",
  fontWeight: "$bold",
  fontSize: 40,
  lineHeight: 1.3,
  textAlign: "center",
});

const UserMeta = styled("div", {
  textAlign: "center",
  display: "flex",
  flexFlow: "row wrap",
  marginBottom: "$4",
  "& > *": {
    flex: 1,
  },
  fontSize: "$sm",
});

const UserStat = styled("div", {
  fontSize: "$xl",
  fontWeight: "$bold",
});

interface UserCardProps {
  address: string;
  ens?: {
    name: string;
    avatar?: string | null;
  } | null;
}
const UserCard = ({ address, ens }: UserCardProps) => {
  return (
    <div>
      <AddressHeader>
        <WalletAddress
          address={address}
          ens={ens}
          css={{ marginRight: "$1" }}
        />
        <a
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLinkIcon />
        </a>
      </AddressHeader>
      <UserMeta>
        <div><CalendarIcon/> Joined Jan 1, 2022</div>
        <div><ClockIcon/> Last seen Jan 1, 2022</div>
      </UserMeta>
      <UserMeta>
        <div>
          <UserStat>12</UserStat>submissions
        </div>
        <div>
          <UserStat>345</UserStat>upvotes
        </div>
        <div>
          <UserStat>6789</UserStat>upvoted
        </div>
      </UserMeta>
    </div>
  );
};

export default UserCard;
