import create from "zustand";
import namehash from "@ensdomains/eth-ens-namehash";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useContract, useProvider } from "wagmi";

interface EnsState {
  resolvedNames: { [address: string]: string | null };
  addResolvedAddresses: (resolves: { [adress: string]: string | null }) => void;
}
export const useEnsStore = create<EnsState>((set) => ({
  resolvedNames: {},
  addResolvedAddresses: (resolves: { [adress: string]: string | null }) =>
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

export async function lookupEns(addresses: string[], contract: any) {
  if (addresses.length === 0) {
    return [];
  }
  const [allNames] = await contract.functions.getNames(addresses);
  const validNames = allNames.map((n: any) => {
    return namehash.normalize(n) === n && n !== "" ? n : null;
  });
  return validNames;
}

export const useEnsContract = () => {
  const signerOrProvider = useProvider();
  const contractConfig = useMemo(
    () => ({
      // mainnet ens contract for reverse lookup
      addressOrName: "0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C",
      contractInterface: abi,
      signerOrProvider,
    }),
    [signerOrProvider]
  );
  const contract = useContract(contractConfig);
  const contractRef = useRef(contract);
  useEffect(() => {
    contractRef.current = contract;
  }, [contract]);
  return contractRef;
};

export const useEnsLookup = (
  addresses: string[] | string | null
): Record<string, string | null> => {
  const resolvedNames = useEnsStore(
    useCallback((state) => state.resolvedNames, [])
  );
  const addResolvedAddresses = useEnsStore(
    useCallback((state) => state.addResolvedAddresses, [])
  );
  const unresolvedAddresses = useMemo(() => {
    const uniqAddresses = addresses
      ? [...new Set(Array.isArray(addresses) ? addresses : [addresses])]
      : [];
    return uniqAddresses.filter((address) => !(address in resolvedNames));
  }, [addresses, resolvedNames]);

  const contractRef = useEnsContract();

  useEffect(() => {
    (async () => {
      if (unresolvedAddresses.length === 0) {
        return;
      }
      const validNames = await lookupEns(
        unresolvedAddresses,
        contractRef.current
      );
      addResolvedAddresses(
        validNames.reduce(
          (
            acc: { [address: string]: string | null },
            name: string | null,
            idx: number
          ) => {
            acc[unresolvedAddresses[idx]] = name ?? null;
            return acc;
          },
          {} as { [address: string]: string | null }
        )
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addResolvedAddresses, unresolvedAddresses]);

  return resolvedNames;
};
