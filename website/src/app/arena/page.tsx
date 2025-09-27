'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseEther } from 'viem';
import { SWAP_ARENA_ADDRESS, SWAP_ARENA_ABI } from '@/lib/swap-arena';
import { useState, useEffect } from 'react';

const POOL_ID = '0x1164da6a9267333cefbc28ce74e198f00dd05705b6c0cae8303041e956baedf6' as const; // Real PoolId from creation

export default function ArenaPage() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [isPut, setIsPut] = useState(true);
  const [questType, setQuestType] = useState(0); // 0: VOLUME, 1: FREQUENCY
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: bexCoin } = useReadContract({
    address: SWAP_ARENA_ADDRESS,
    abi: SWAP_ARENA_ABI,
    functionName: 'bexCoin',
  });

  const { data: questStatus } = useReadContract({
    address: SWAP_ARENA_ADDRESS,
    abi: SWAP_ARENA_ABI,
    functionName: 'getQuestStatus',
    args: [POOL_ID],
    query: {
      enabled: isConnected,
    },
  });

  const { data: currentStats } = useReadContract({
    address: SWAP_ARENA_ADDRESS,
    abi: SWAP_ARENA_ABI,
    functionName: 'getCurrentQuestStats',
    args: [POOL_ID],
    query: {
      enabled: isConnected,
    },
  });

  const { data: currentIndex } = useReadContract({
    address: SWAP_ARENA_ADDRESS,
    abi: SWAP_ARENA_ABI,
    functionName: 'currentPoolIndex',
    args: [POOL_ID],
    query: {
      enabled: isConnected,
    },
  });

  const { data: questId } = useReadContract({
    address: SWAP_ARENA_ADDRESS,
    abi: SWAP_ARENA_ABI,
    functionName: 'getQuestId',
    args: [POOL_ID, currentIndex!],
    query: {
      enabled: isConnected && !!currentIndex,
    },
  });

  const { writeContract, isPending } = useWriteContract();

  const handleJoinQuest = () => {
    if (!amount || !address || !questId) return;

    writeContract({
      address: SWAP_ARENA_ADDRESS,
      abi: SWAP_ARENA_ABI,
      functionName: 'joinQuest',
      args: [POOL_ID, BigInt(parseEther(amount)), isPut, questType],
    });
  };

  const handleClaimReward = () => {
    if (!questId) return;

    writeContract({
      address: SWAP_ARENA_ADDRESS,
      abi: SWAP_ARENA_ABI,
      functionName: 'claimReward',
      args: [questId],
    });
  };

  const handleSettleQuest = () => {
    writeContract({
      address: SWAP_ARENA_ADDRESS,
      abi: SWAP_ARENA_ABI,
      functionName: 'settleQuest',
      args: [POOL_ID],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Swap Arena</h1>
        
        {/* Wallet Connection */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Connect Wallet</h2>
          <ConnectButton />
          {mounted && isConnected && <p className="mt-2">Connected: {address}</p>}
        </div>

        {/* Contract Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Contract Information</h2>
          <p><strong>SwapArena Address:</strong> {SWAP_ARENA_ADDRESS}</p>
          <p><strong>BEX Token:</strong> {bexCoin || 'Loading...'}</p>
          <p className="mt-2">
            SwapArena is a Uniswap V4 hook that turns swaps into competitive quests. 
            Stake BEX tokens on whether buys or sells will dominate in volume or frequency over 24 hours.
          </p>
        </div>

        {isConnected && (
          <>
            {/* Quest Status */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-4">Current Quest Status</h2>
              <p><strong>Active:</strong> {questStatus?.[0] ? 'Yes' : 'No'}</p>
              <p><strong>Time Remaining:</strong> {questStatus?.[1]?.toString() || 'N/A'} seconds</p>
              <p><strong>Quest ID:</strong> {questId?.toString() || 'N/A'}</p>
              {questStatus?.[0] === false && (
                <button
                  onClick={handleSettleQuest}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Settle Quest
                </button>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-4">Quest Statistics</h2>
              {currentStats && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Total Buys:</strong> {currentStats.totalBuys.toString()}</p>
                    <p><strong>Total Sells:</strong> {currentStats.totalSells.toString()}</p>
                  </div>
                  <div>
                    <p><strong>Buy Volume:</strong> {currentStats.totalVolumeOfBuys.toString()}</p>
                    <p><strong>Sell Volume:</strong> {currentStats.totalVolumeOfSells.toString()}</p>
                  </div>
                  <div>
                    <p><strong>Start Time:</strong> {new Date(Number(currentStats.startTime) * 1000).toLocaleString()}</p>
                    <p><strong>End Time:</strong> {new Date(Number(currentStats.endTime) * 1000).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Join Quest */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-4">Join Quest</h2>
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Amount of BEX to stake"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div>
                  <label>
                    <input
                      type="radio"
                      checked={isPut}
                      onChange={() => setIsPut(true)}
                    />
                    Put (Bet on Buys)
                  </label>
                  <label className="ml-4">
                    <input
                      type="radio"
                      checked={!isPut}
                      onChange={() => setIsPut(false)}
                    />
                    Call (Bet on Sells)
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      checked={questType === 0}
                      onChange={() => setQuestType(0)}
                    />
                    Volume
                  </label>
                  <label className="ml-4">
                    <input
                      type="radio"
                      checked={questType === 1}
                      onChange={() => setQuestType(1)}
                    />
                    Frequency
                  </label>
                </div>
                <button
                  onClick={handleJoinQuest}
                  disabled={!amount || isPending}
                  className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {isPending ? 'Joining...' : 'Join Quest'}
                </button>
              </div>
            </div>

            {/* Claim Reward */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Claim Reward</h2>
              <button
                onClick={handleClaimReward}
                disabled={!questId}
                className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Claim Reward
              </button>
            </div>
          </>
        )}

        {/* Swapping and Liquidity Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-2xl font-semibold mb-4">Swapping and Liquidity</h2>
          <p>
            SwapArena is integrated as a hook in Uniswap V4 pools. To swap tokens and contribute to quests:
          </p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Connect to a Uniswap V4 pool with the SwapArena hook attached.</li>
            <li>Perform swaps using the Uniswap interface or SDK.</li>
            <li>Each swap updates the quest statistics (buys/sells volume and frequency).</li>
            <li>Add liquidity to the pool to earn fees while participating in quests.</li>
          </ol>
          <p className="mt-2 text-sm text-gray-600">
            Note: Specific pool details (tokens, fees) need to be configured. Current implementation uses mock tokens for testing.
          </p>
        </div>
      </div>
    </div>
  );
}