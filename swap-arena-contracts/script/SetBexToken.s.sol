// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {SwapArena} from "../src/SwapArena.sol";

contract SetBexTokenScript is Script {
    function run() external {
        vm.startBroadcast();

        SwapArena arena = SwapArena(0xc62a2207D15Dc7946e80694311767aE13d588040);
        address bexToken = 0x8A163E553b4c3bAFA610b83a3D564bF4ea3ACd57; // MOCKA as BEX

        arena.setToken(bexToken);

        vm.stopBroadcast();
    }
}