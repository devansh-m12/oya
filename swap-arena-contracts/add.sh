#!/bin/bash
source .env
forge script script/02_AddLiquidity.s.sol --broadcast --rpc-url $RPC_URL --private-key $PRIVATE_KEY