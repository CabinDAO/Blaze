import Card from "@/components/Card";
import UserCard from "@/components/UserCard";
import { useWallet } from "@/components/WalletAuth";
import Title from "@/components/Title";



const Profile = () => {
  const { address, ens } = useWallet();

  return (
    <>
      {address && (
        <>
          <Title>Profile</Title>
          <Card>
            <UserCard address={address} ens={ens} />
          </Card>
        </>
      )}
    </>
  );
  ;
};

export default Profile;
