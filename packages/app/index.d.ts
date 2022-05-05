declare module "@ensdomains/eth-ens-namehash" {
  const namehash = {
    hash: (input: string) => string,
    normalize: (input: string) => string,
  };
  export default namehash;
}
