// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {RandomNumber} from "../src/Random.sol";

contract RandomNumberScript is Script {
    function run() public {
        vm.startBroadcast();

        RandomNumber randomNumber = new RandomNumber(
            0x4821932D0CDd71225A6d914706A621e0389D7061,
            0x6CC14824Ea2918f5De5C2f75A9Da968ad4BD6344
        );

        vm.stopBroadcast();
    }
}