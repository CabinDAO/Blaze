import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import { useWallet } from "@/components/WalletAuth";
import { useEffect } from "react";

const UnknownUser = () => {
  return (
    <div>
      <p>Connect your wallet to view your profile.</p>
    </div>
  );
};

const Profile = () => {
  const { address } = useWallet();

  if (!address) {
    return <UnknownUser />;
  }

  return (
    <div>
      <Card>
        <UserCard address={address} />
      </Card>
    </div>
  );
};

export default Profile;