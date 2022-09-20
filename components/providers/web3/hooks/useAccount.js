import { useEffect } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0x66d3150995084db96d2ce48cf3193c4f22548b3dd91279b93fc6c19a9af81575": true,
  "0xf1493221c04b9c314cdf01b487afb8797c511962bb27e5250a2c8221fbb74bbc": true,
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 != null ? "web3/accounts" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error(
          "Cannot retreive an account. Please refresh the browser."
        );
      }

      return account;
    }
  );

  useEffect(() => {
    const mutator = (accounts) => mutate(accounts[0] ?? null);
    provider?.on("accountsChanged", mutator);

    return () => {
      provider?.removeListener("accountsChanged", mutator);
    };
  }, [provider]);

  return {
    data,
    isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,
    mutate,
    ...rest,
  };
};
