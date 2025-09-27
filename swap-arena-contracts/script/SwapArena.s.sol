// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";

import {Constants} from "./base/Constants.sol";
import {SwapArena} from "../src/SwapArena.sol";
import {HookMiner} from "v4-periphery/src/utils/HookMiner.sol";

/// @notice Mines the address and deploys the Counter.sol Hook contract
contract CounterScript is Script, Constants {
    function setUp() public {}

    function run() public {
        // hook contracts must have specific flags encoded in the address
        uint160 flags = uint160(
         Hooks.AFTER_SWAP_FLAG
        );

        // Mine a salt that will produce a hook address with the correct flags
        bytes memory constructorArgs = abi.encode(0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408, msg.sender);
        (address hookAddress, bytes32 salt) =
            HookMiner.find(CREATE2_DEPLOYER, flags, type(SwapArena).creationCode, constructorArgs);

        // Deploy the hook using CREATE2
        vm.broadcast();
        SwapArena counter = new SwapArena{salt: salt}(IPoolManager(0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408), msg.sender);
        require(address(counter) == hookAddress, "SwapArenaScript: hook address mismatch");
    }
}
