export const SWAP_ARENA_ADDRESS = '0xc62a2207d15dc7946e80694311767ae13d588040' as const;

export const SWAP_ARENA_ABI = [
  {
    "inputs": [
      {
        "internalType": "contract IPoolManager",
        "name": "_poolManager",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "AddressEmptyCode",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "AddressInsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyClaimed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FailedInnerCall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "HasAlreadyStaked",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "HookNotImplemented",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidQuestType",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoStakeAmount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotAWinner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotPoolManager",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      }
    ],
    "name": "QuestClosed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "QuestNotStarted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "QuestStillOngoing",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransferFailed",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint128",
        "name": "amount",
        "type": "uint128"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isPut",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "PoolId",
        "name": "poolId",
        "type": "bytes32"
      }
    ],
    "name": "JoinedQuest",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "PoolId",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint40",
        "name": "index",
        "type": "uint40"
      },
      {
        "indexed": false,
        "internalType": "uint40",
        "name": "startTime",
        "type": "uint40"
      },
      {
        "indexed": false,
        "internalType": "uint40",
        "name": "endTime",
        "type": "uint40"
      }
    ],
    "name": "NewQuestStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalWinners",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalReward",
        "type": "uint256"
      }
    ],
    "name": "QuestRewardDistributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RewardClaimed",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "COOLDOWN_PERIOD",
    "outputs": [
      {
        "internalType": "uint40",
        "name": "",
        "type": "uint40"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "JOIN_WINDOW",
    "outputs": [
      {
        "internalType": "uint40",
        "name": "",
        "type": "uint40"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "QUEST_DURATION",
    "outputs": [
      {
        "internalType": "uint40",
        "name": "",
        "type": "uint40"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "REWARD_FEE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "int24",
            "name": "tickLower",
            "type": "int24"
          },
          {
            "internalType": "int24",
            "name": "tickUpper",
            "type": "int24"
          },
          {
            "internalType": "int256",
            "name": "liquidityDelta",
            "type": "int256"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IPoolManager.ModifyLiquidityParams",
        "name": "params",
        "type": "tuple"
      },
      {
        "internalType": "BalanceDelta",
        "name": "delta",
        "type": "int256"
      },
      {
        "internalType": "BalanceDelta",
        "name": "feesAccrued",
        "type": "int256"
      },
      {
        "internalType": "bytes",
        "name": "hookData",
        "type": "bytes"
      }
    ],
    "name": "afterAddLiquidity",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      },
      {
        "internalType": "BalanceDelta",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "hookData",
        "type": "bytes"
      }
    ],
    "name": "afterDonate",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "internalType": "uint160",
        "name": "sqrtPriceX96",
        "type": "uint160"
      },
      {
        "internalType": "int24",
        "name": "tick",
        "type": "int24"
      }
    ],
    "name": "afterInitialize",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "int24",
            "name": "tickLower",
            "type": "int24"
          },
          {
            "internalType": "int24",
            "name": "tickUpper",
            "type": "int24"
          },
          {
            "internalType": "int256",
            "name": "liquidityDelta",
            "type": "int256"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IPoolManager.ModifyLiquidityParams",
        "name": "params",
        "type": "tuple"
      },
      {
        "internalType": "BalanceDelta",
        "name": "delta",
        "type": "int256"
      },
      {
        "internalType": "BalanceDelta",
        "name": "feesAccrued",
        "type": "int256"
      },
      {
        "internalType": "bytes",
        "name": "hookData",
        "type": "bytes"
      }
    ],
    "name": "afterRemoveLiquidity",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      },
      {
        "internalType": "BalanceDelta",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "zeroForOne",
            "type": "bool"
          },
          {
            "internalType": "int256",
            "name": "amountSpecified",
            "type": "int256"
          },
          {
            "internalType": "uint160",
            "name": "sqrtPriceLimitX96",
            "type": "uint160"
          }
        ],
        "internalType": "struct IPoolManager.SwapParams",
        "name": "params",
        "type": "tuple"
      },
      {
        "internalType": "BalanceDelta",
        "name": "delta",
        "type": "int256"
      },
      {
        "internalType": "bytes",
        "name": "hookData",
        "type": "bytes"
      }
    ],
    "name": "afterSwap",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      },
      {
        "internalType": "int128",
        "name": "",
        "type": "int128"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "int24",
            "name": "tickLower",
            "type": "int24"
          },
          {
            "internalType": "int24",
            "name": "tickUpper",
            "type": "int24"
          },
          {
            "internalType": "int256",
            "name": "liquidityDelta",
            "type": "int256"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IPoolManager.ModifyLiquidityParams",
        "name": "params",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "hookData",
        "type": "bytes"
      }
    ],
    "name": "beforeAddLiquidity",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "amount0",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount1",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "hookData",
        "type": "bytes"
      }
    ],
    "name": "beforeDonate",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "internalType": "uint160",
        "name": "sqrtPriceX96",
        "type": "uint160"
      }
    ],
    "name": "beforeInitialize",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "int24",
            "name": "tickLower",
            "type": "int24"
          },
          {
            "internalType": "int24",
            "name": "tickUpper",
            "type": "int24"
          },
          {
            "internalType": "int256",
            "name": "liquidityDelta",
            "type": "int256"
          },
          {
            "internalType": "bytes32",
            "name": "salt",
            "type": "bytes32"
          }
        ],
        "internalType": "struct IPoolManager.ModifyLiquidityParams",
        "name": "params",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "hookData",
        "type": "bytes"
      }
    ],
    "name": "beforeRemoveLiquidity",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "Currency",
            "name": "currency0",
            "type": "address"
          },
          {
            "internalType": "Currency",
            "name": "currency1",
            "type": "address"
          },
          {
            "internalType": "uint24",
            "name": "fee",
            "type": "uint24"
          },
          {
            "internalType": "int24",
            "name": "tickSpacing",
            "type": "int24"
          },
          {
            "internalType": "contract IHooks",
            "name": "hooks",
            "type": "address"
          }
        ],
        "internalType": "struct PoolKey",
        "name": "key",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "bool",
            "name": "zeroForOne",
            "type": "bool"
          },
          {
            "internalType": "int256",
            "name": "amountSpecified",
            "type": "int256"
          },
          {
            "internalType": "uint160",
            "name": "sqrtPriceLimitX96",
            "type": "uint160"
          }
        ],
        "internalType": "struct IPoolManager.SwapParams",
        "name": "params",
        "type": "tuple"
      },
      {
        "internalType": "bytes",
        "name": "hookData",
        "type": "bytes"
      }
    ],
    "name": "beforeSwap",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      },
      {
        "internalType": "BeforeSwapDelta",
        "name": "",
        "type": "int256"
      },
      {
        "internalType": "uint24",
        "name": "",
        "type": "uint24"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "bexCoin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      }
    ],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "PoolId",
        "name": "poolId",
        "type": "bytes32"
      }
    ],
    "name": "currentPoolIndex",
    "outputs": [
      {
        "internalType": "uint40",
        "name": "currentIndex",
        "type": "uint40"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "PoolId",
        "name": "poolId",
        "type": "bytes32"
      }
    ],
    "name": "getCurrentQuestStats",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint40",
            "name": "totalBuys",
            "type": "uint40"
          },
          {
            "internalType": "uint40",
            "name": "totalSells",
            "type": "uint40"
          },
          {
            "internalType": "uint256",
            "name": "totalVolumeOfSells",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "totalVolumeOfBuys",
            "type": "uint256"
          },
          {
            "internalType": "uint40",
            "name": "startTime",
            "type": "uint40"
          },
          {
            "internalType": "uint40",
            "name": "endTime",
            "type": "uint40"
          }
        ],
        "internalType": "struct SwapArena.TradeStats",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHookPermissions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "beforeInitialize",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "afterInitialize",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "beforeAddLiquidity",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "afterAddLiquidity",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "beforeRemoveLiquidity",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "afterRemoveLiquidity",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "beforeSwap",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "afterSwap",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "beforeDonate",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "afterDonate",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "beforeSwapReturnDelta",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "afterSwapReturnDelta",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "afterAddLiquidityReturnDelta",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "afterRemoveLiquidityReturnDelta",
            "type": "bool"
          }
        ],
        "internalType": "struct Hooks.Permissions",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "PoolId",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "internalType": "uint40",
        "name": "_currentIndex",
        "type": "uint40"
      }
    ],
    "name": "getQuestId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "PoolId",
        "name": "poolId",
        "type": "bytes32"
      }
    ],
    "name": "getQuestStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "uint40",
        "name": "timeRemaining",
        "type": "uint40"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      }
    ],
    "name": "getQuesterCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      }
    ],
    "name": "getQuestersList",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      }
    ],
    "name": "getWinnerCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      }
    ],
    "name": "getWinnerList",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "PoolId",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "internalType": "uint128",
        "name": "_amount",
        "type": "uint128"
      },
      {
        "internalType": "bool",
        "name": "_isPut",
        "type": "bool"
      },
      {
        "internalType": "enum SwapArena.QuestType",
        "name": "_type",
        "type": "uint8"
      }
    ],
    "name": "joinQuest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolManager",
    "outputs": [
      {
        "internalType": "contract IPoolManager",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "questQuestersList",
    "outputs": [
      {
        "internalType": "address",
        "name": "questQuesters",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      }
    ],
    "name": "questTotalStaked",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalStakedVolume",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalStakedFrequency",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "winnersTotalStakeAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "PoolId",
        "name": "poolId",
        "type": "bytes32"
      },
      {
        "internalType": "uint40",
        "name": "index",
        "type": "uint40"
      }
    ],
    "name": "questTradeStats",
    "outputs": [
      {
        "internalType": "uint40",
        "name": "totalBuys",
        "type": "uint40"
      },
      {
        "internalType": "uint40",
        "name": "totalSells",
        "type": "uint40"
      },
      {
        "internalType": "uint256",
        "name": "totalVolumeOfSells",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalVolumeOfBuys",
        "type": "uint256"
      },
      {
        "internalType": "uint40",
        "name": "startTime",
        "type": "uint40"
      },
      {
        "internalType": "uint40",
        "name": "endTime",
        "type": "uint40"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "questWinnersList",
    "outputs": [
      {
        "internalType": "address",
        "name": "questWinners",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "setToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "PoolId",
        "name": "poolId",
        "type": "bytes32"
      }
    ],
    "name": "settleQuest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "questId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "userQuestStakes",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isPut",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "hasStaked",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "stakedAmount",
        "type": "uint256"
      },
      {
        "internalType": "enum SwapArena.QuestType",
        "name": "questType",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "isClaimed",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "rewardAmount",
        "type": "uint256"
      },
      {
        "internalType": "enum SwapArena.UserQuest",
        "name": "isWinner",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
