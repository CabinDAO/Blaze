import create from "zustand";
import namehash from "@ensdomains/eth-ens-namehash";
import { useEffect, useMemo } from "react";
import { useContract } from "wagmi";

interface EnsState {
  resolvedNames: { [address: string]: string };
  addResolvedAddresses: (resolves: { [adress: string]: string }) => void;
}
export const useEnsStore = create<EnsState>((set) => ({
  resolvedNames: {},
  addResolvedAddresses: (resolves: { [adress: string]: string }) =>
    set((state) => ({
      ...state,
      resolvedNames: { ...state.resolvedNames, ...resolves },
    })),
}));

const abi = [
  {
    inputs: [{ internalType: "contract ENS", name: "_ens", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address[]", name: "addresses", type: "address[]" },
    ],
    name: "getNames",
    outputs: [{ internalType: "string[]", name: "r", type: "string[]" }],
    stateMutability: "view",
    type: "function",
  },
];

export const useEnsLookup = (
  addresses: string[],
  signerOrProvider: any
): (string | null)[] => {
  const addResolvedAddresses = useEnsStore(
    (state) => state.addResolvedAddresses
  );
  // check if the ens store has all of the addresses already resolved
  const resolvedNames = useEnsStore((state) => state.resolvedNames);

  const resolvedAddresses = Object.keys(resolvedNames);
  const unresolvedAddresses = addresses.filter(
    (address) => !resolvedAddresses.includes(address)
  );

  const contract = useContract({
    // mainnet ens contract for reverse lookup
    addressOrName: "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C",
    contractInterface: abi,
    signerOrProvider,
  });

  useEffect(() => {
    (async () => {
      if (unresolvedAddresses.length === 0) {
        return;
      }
      const [allNames] = await contract.functions.getNames(unresolvedAddresses);
      const validNames = allNames.map((n: any) => {
        return namehash.normalize(n) === n && n !== "" ? n : null;
      });

      addResolvedAddresses(
        validNames.reduce(
          (acc: { [address: string]: string }, name: string, idx: number) => {
            acc[unresolvedAddresses[idx]] = name ?? null;
            return acc;
          },
          {} as { [address: string]: string }
        )
      );
    })();
  }, [addResolvedAddresses, unresolvedAddresses, contract]);

  return useMemo(
    () => addresses.map((address) => resolvedNames[address] ?? null),
    [addresses, resolvedNames]
  );
};
