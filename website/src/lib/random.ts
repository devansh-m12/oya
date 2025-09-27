import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xC076fF703dAba7f183b747EC3F81D0b9803B0F27";

const ABI = [
  "function getRandomFee() view returns (uint256)",
  "function requestRandom() payable",
  "event RandomRequest(uint64 sequenceNumber)",
  "event RandomResult(uint64 sequenceNumber, bytes32 randomNumber)"
] as const;

export async function getRandomNumber(): Promise<{ randomNumber: string }> {
  const RPC_URL = process.env.RPC_URL!;
  const PRIVATE_KEY = process.env.PRIVATE_KEY!;

  if (!RPC_URL || !PRIVATE_KEY) {
    throw new Error("RPC_URL and PRIVATE_KEY must be set in environment variables");
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

  console.log("Fetching random fee...");
  const fee = await contract.getRandomFee();
  console.log(`Fee: ${fee.toString()} wei`);

  console.log("Requesting random number...");
  const tx = await contract.requestRandom({ value: fee });
  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait();
  if (!receipt) {
    throw new Error("Transaction receipt not available.");
  }
  console.log(`Transaction confirmed in block ${receipt.blockNumber ?? 'pending'}`);

  // Parse events from receipt
  const randomRequestEvent = receipt.logs.find((log: ethers.Log): log is ethers.Log => {
    const parsed = contract.interface.parseLog(log);
    return parsed !== null && parsed.name === "RandomRequest";
  });

  if (!randomRequestEvent) {
    throw new Error("No RandomRequest event found in transaction receipt.");
  }

  const parsed = contract.interface.parseLog(randomRequestEvent);
  if (!parsed) {
    throw new Error("Failed to parse RandomRequest event.");
  }

  const sequenceNumber = parsed.args.sequenceNumber as bigint;
  console.log(`Random requested with sequence number: ${sequenceNumber.toString()}`);

  // Wait for RandomResult event
  console.log("Listening for RandomResult event...");
  const resultPromise = new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timeout waiting for random result (60s)"));
    }, 60000);

    const handler = (seqNum: bigint, randomNumber: string) => {
      if (seqNum === sequenceNumber) {
        clearTimeout(timeout);
        contract.off("RandomResult", handler);
        resolve(randomNumber);
      }
    };

    contract.on("RandomResult", handler);
  });

  const randomNumber = await resultPromise;
  console.log(`Random result received: ${randomNumber}`);

  return { randomNumber };
}