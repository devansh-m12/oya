import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config({ path: "contracts/.env" });

const RPC_URL = process.env.RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const CONTRACT_ADDRESS = "0xC076fF703dAba7f183b747EC3F81D0b9803B0F27";

const ABI = [
  "function getRandomFee() view returns (uint256)",
  "function requestRandom() payable",
  "event RandomRequest(uint64 sequenceNumber)",
  "event RandomResult(uint64 sequenceNumber, bytes32 randomNumber)"
] as const;

async function main() {
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
    console.log("Transaction receipt not available.");
    process.exit(1);
  }
  console.log(`Transaction confirmed in block ${receipt.blockNumber ?? 'pending'}`);

  // Parse events from receipt
  const randomRequestEvent = receipt.logs.find((log: ethers.Log): log is ethers.Log => {
    const parsed = contract.interface.parseLog(log);
    return parsed !== null && parsed.name === "RandomRequest";
  });

  if (randomRequestEvent) {
    const parsed = contract.interface.parseLog(randomRequestEvent);
    if (parsed) {
      const sequenceNumber = parsed.args.sequenceNumber as bigint;
      console.log(`Random requested with sequence number: ${sequenceNumber.toString()}`);

      // Listen for RandomResult event
      console.log("Listening for RandomResult event...");
      contract.on("RandomResult", (seqNum: bigint, randomNumber: string) => {
        if (seqNum === sequenceNumber) {
          console.log(`Random result received! Sequence: ${seqNum.toString()}, Random Number: ${randomNumber}`);
          process.exit(0);
        }
      });
    }
  } else {
    console.log("No RandomRequest event found in transaction receipt.");
  }

  // Keep the script running to listen for events
  process.stdin.resume();
}

main().catch(console.error);