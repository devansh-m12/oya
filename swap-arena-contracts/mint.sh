#!/bin/bash
source .env
forge script script/01_CreatePoolAndMintLiquidity.s.sol --broadcast --rpc-url $RPC_URL --private-key $PRIVATE_KEY