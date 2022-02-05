import { CalendarIcon, ClockIcon, ExternalLinkIcon } from "../Icons";
import { styled } from "@/stitches.config";
import WalletAddress from "../WalletAddress";
import { fromUnixTime, format } from "date-fns";

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
  joinDate: Date;
  lastSeenDate: Date;
  upvotesReceived: number;
  linksUpvoted: number;
}
const UserCard = ({ address, ens, joinDate, lastSeenDate, upvotesReceived, linksUpvoted }: UserCardProps) => {
  const joinDateString = fromUnixTime(joinDate).toLocaleDateString();
  const lastSeenDateString = fromUnixTime(lastSeenDate).toLocaleDateString();
  return (
    <div>
      <AddressHeader>
        <WalletAddress
          address={address}
          ens={ens}
          css={{ marginRight: "$1" }}
        />
        <ExternalLinkIcon href={`https://etherscan.io/address/${address}`} />
      </AddressHeader>
      <UserMeta>
        <div>
          <CalendarIcon /> Joined {joinDateString}
        </div>
        <div>
          <ClockIcon /> Last seen {lastSeenDateString}
        </div>
      </UserMeta>
      <UserMeta>
        <div>
          <UserStat>12</UserStat>submissions
        </div>
        <div>
          <UserStat>{upvotesReceived}</UserStat>upvotes
        </div>
        <div>
          <UserStat>{linksUpvoted}</UserStat>upvoted
        </div>
      </UserMeta>
    </div>
  );
};

export default UserCard;
