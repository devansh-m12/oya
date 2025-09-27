#!/bin/bash
source .env
forge script script/03_Swap.s.sol --broadcast --rpc-url $RPC_URL --private-key $PRIVATE_KEY