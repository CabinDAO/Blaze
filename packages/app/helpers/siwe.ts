import { useEffect } from "react";
import { useStore } from "@/store/store";

export const useSiweSession = () => {
  const {
    setSiweAddress,
    setSiweLoading,
    siwe: { address, loading },
  } = useStore();
  useEffect(() => {
    const handler = async () => {
      try {
        setSiweLoading(true);
        const res = await fetch("/api/me");
        const json = await res.json();
        setSiweAddress(json.address);
      } finally {
        setSiweLoading(false);
      }
    };
    // 1. page loads
    (async () => await handler())();

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener("focus", handler);
    return () => window.removeEventListener("focus", handler);
  }, [setSiweAddress, setSiweLoading]);
  return { address, loading: loading ?? true };
};
