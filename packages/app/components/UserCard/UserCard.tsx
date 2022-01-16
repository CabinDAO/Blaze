import { styled } from "@/stitches.config";
import WalletAddress from "../WalletAddress";

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
  },
});

const UserStat = styled("div", {
  fontSize: "$xl",
  fontWeight: "$bold",
});

interface UserCardProps {
  address: string;
}
const UserCard = ({ address }: UserCardProps) => {
  return (
    <div>
      <AddressHeader>
        <WalletAddress address={address} />
        <a
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noreferrer"
        >
          [L]
        </a>
      </AddressHeader>
      <UserMeta>
        <div>Joined Jan 1, 2022</div>
        <div>Last seen Jan 1, 2022</div>
      </UserMeta>
      <UserMeta>
        <div>
          <UserStat>12</UserStat>submissions
        </div>
        <div>
          <UserStat>345</UserStat>upvotes
        </div>
        <div>
          <UserStat>6789</UserStat>upvoated
        </div>
      </UserMeta>
    </div>
  );
};

export default UserCard;
