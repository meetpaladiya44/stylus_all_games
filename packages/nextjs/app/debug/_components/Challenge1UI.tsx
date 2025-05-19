"use client";

import { useState } from "react";
import { createPublicClient, http, isAddress } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { Address } from "~~/components/scaffold-eth";

export const Challenge1UI = () => {
  const [userAddress, setUserAddress] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Static contract details
  const contractAddress = "0x0000000000000000000000000000000000000071";
  const contractName = "Challenge1";

  // Function from Challenge1 contract ABI
  const contractAbi = [
    {
      type: "function",
      name: "programInitGas",
      inputs: [
        {
          name: "program",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "gas",
          type: "uint64",
          internalType: "uint64",
        },
        {
          name: "gasWhenCached",
          type: "uint64",
          internalType: "uint64",
        },
      ],
      stateMutability: "view",
    },
  ] as const;

  // Create a direct client for Arbitrum Sepolia
  const client = createPublicClient({
    chain: arbitrumSepolia,
    transport: http("https://sepolia-rollup.arbitrum.io/rpc"),
  });

  // Function to call the contract
  const readContractData = async () => {
    if (!userAddress || !isAddress(userAddress)) {
      setErrorMessage("Please enter a valid Ethereum address");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await client.readContract({
        address: contractAddress,
        abi: contractAbi,
        functionName: "programInitGas",
        args: [userAddress],
      });

      setResult(data);
    } catch (err) {
      console.error("Error calling contract:", err);
      setErrorMessage((err as Error)?.message || "Failed to read from contract");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      <div className="w-full max-w-7xl">
        <div className="bg-base-300 border border-green-700 shadow-md shadow-secondary rounded-md px-6 lg:px-8 mb-6 space-y-1 py-4">
          <div className="flex flex-col gap-1">
            <span className="font-bold">{contractName}</span>
            <Address address={contractAddress} />
            <div className="flex gap-1 items-center">
              <span className="font-bold text-sm">Network:</span>
              <span className="text-amber-500">Arbitrum Sepolia</span>
            </div>
          </div>
        </div>

        <div className="bg-base-300 rounded-md border border-base-300 flex flex-col mt-6 p-5">
          <div className="mb-4">
            <p className="font-medium my-0">Call programInitGas(address)</p>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Enter Program Address:</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={userAddress}
                onChange={e => setUserAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            {errorMessage && <p className="text-error mt-1">{errorMessage}</p>}

            <button className="btn btn-secondary btn-sm" onClick={readContractData} disabled={isLoading}>
              {isLoading && <span className="loading loading-spinner loading-xs"></span>}
              Read 📡
            </button>
          </div>

          {result !== null && (
            <div className="bg-secondary rounded-3xl text-sm px-4 py-1.5 mt-4">
              <p className="font-bold m-0 mb-1">Result:</p>
              <pre className="whitespace-pre-wrap break-words">
                Gas: {result?.[0]?.toString() || "N/A"} <br />
                Gas When Cached: {result?.[1]?.toString() || "N/A"}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
