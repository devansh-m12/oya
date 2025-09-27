# Pyth Entropy Random Contract

This Foundry project deploys a smart contract using Pyth Network's Entropy for on-chain randomness.

## Deployed Contract
- **Address**: `0xC076fF703dAba7f183b747EC3F81D0b9803B0F27`
- **Network**: Optimism Sepolia
- **Explorer**: [Entropy Explorer](https://entropy-explorer.pyth.network/?chain=all-testnet&search=5674)

## Setup
1. Install dependencies: `npm install`
2. Configure `.env` with `RPC_URL` and `PRIVATE_KEY`

## Usage
- Build: `forge build`
- Test randomness: `npx ts-node scripts/test-random.ts`
- Deploy: `forge script script/RandomNumber.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast`

## Contract
See [`src/Random.sol`](src/Random.sol) for the implementation.
