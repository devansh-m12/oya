import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther } from 'viem';

const CONTRACT_ADDRESS = '0xc076ff703daba7f183b747ec3f81d0b9803b0f27' as const;

const ABI = [
  {
    "inputs": [],
    "name": "getRandomFee",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requestRandom",
    "outputs": [{"name": "", "type": "uint64"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [{"name": "sequenceNumber", "type": "uint64", "indexed": false}],
    "name": "RandomRequest",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"name": "sequenceNumber", "type": "uint64", "indexed": false},
      {"name": "randomNumber", "type": "bytes32", "indexed": false}
    ],
    "name": "RandomResult",
    "type": "event"
  }
] as const;

export function useRandomFee() {
  const { data: fee } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getRandomFee',
    chainId: sepolia.id,
  });

  return fee ? parseEther(fee.toString()) : BigInt(0);
}

export function useRequestRandom() {
  const { writeContract, isPending } = useWriteContract();

  const request = () => {
    const fee = useRandomFee();
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'requestRandom',
      value: fee,
      chainId: sepolia.id,
    });
  };

  return { request, isPending };
}

export function useWatchRandomResult(onResult: (sequenceNumber: bigint, randomNumber: `0x${string}`) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'RandomResult',
    chainId: sepolia.id,
    onLogs: (logs) => {
      for (const log of logs) {
        const { args } = log;
        if (args?.sequenceNumber && args.randomNumber) {
          onResult(args.sequenceNumber, args.randomNumber);
        }
      }
    },
  });
}

export function useWatchRandomRequest(onRequest: (sequenceNumber: bigint) => void) {
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    eventName: 'RandomRequest',
    chainId: sepolia.id,
    onLogs: (logs) => {
      for (const log of logs) {
        const { args } = log;
        if (args?.sequenceNumber) {
          onRequest(args.sequenceNumber);
        }
      }
    },
  });
}