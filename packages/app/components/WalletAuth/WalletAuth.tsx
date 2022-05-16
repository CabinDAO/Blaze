import { Button } from "@cabindao/topo";
import { useAccount } from "wagmi";
import Link from "next/link";
import { useRouter } from "next/router";
import { useStore } from "@/store/store";
import create from "zustand";

interface AccountStore {
  ens: string | null;
  setEns(ens: string | null): void;
}
const useAccountInfo = create<AccountStore>((set) => ({
  ens: null,
  setEns: (ens: string) => set({ ens }),
}));

export const useWallet = (options?: { fetchEns?: boolean }) => {
  const {
    siwe: { address, error },
  } = useStore();

  return {
    isAuthenticated: !error && !!address,
    address: address ?? null,
  };
};

const WalletAuth = () => {
  const router = useRouter();
  const [, disconnect] = useAccount();
  const { siwe, clearSiweSession } = useStore();
  const SignOutHandler = async () => {
    await fetch("/api/logout");
    clearSiweSession();
    disconnect();
    router.push("/");
  };
  if (siwe.address) {
    return (
      <div>
        <Button
          onClick={async () => await SignOutHandler()}
          type="secondary"
          tone="forest"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  if (router.pathname === "/user/sign_in") {
    return null;
  }

  return (
    <Link href="/user/sign_in" passHref>
      <a>
        <Button type="secondary">Sign In</Button>
      </a>
    </Link>
  );
};

export default WalletAuth;
