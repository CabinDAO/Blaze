import {CalendarIcon, ClockIcon, ExternalLinkIcon} from "../Icons";
import {styled} from "@/stitches.config";
import WalletAddress from "../WalletAddress";
import {format, fromUnixTime} from "date-fns";

const AddressHeader = styled("div", {
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
    textAlign: "center",
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
    name: string | null;
    avatar?: string | null;
  } | null;
  joinDate: number;
  lastSeenDate: number;
  upvotesReceived: number;
  linksUpvoted: number;
}
const UserCard = ({
  address,
  ens,
  joinDate,
  lastSeenDate,
  upvotesReceived,
  linksUpvoted,
}: UserCardProps) => {
  const joinDateString = joinDate
    ? format(fromUnixTime(joinDate), "MMM d, yyyy")
    : null;
  const lastSeenDateString = lastSeenDate
    ? format(fromUnixTime(lastSeenDate), "MMM d, yyyy")
    : null;
  return (
    <div>
      <AddressHeader>
        <WalletAddress address={address} ens={ens} css={{marginRight: "$1"}} />
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
