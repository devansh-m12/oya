// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MintTokensScript is Script {
    function run() external {
        vm.startBroadcast();

        // Addresses from deployment
        IERC20 mockA = IERC20(0x8A163E553b4c3bAFA610b83a3D564bF4ea3ACd57); // MOCKA as BEX
        IERC20 mockB = IERC20(0x39C51817f9F82244F36b23B9c2ec73bA895f89E7); // MOCKB

        address deployer = 0x26d04a4c173b04a47Bb7ec74D3A2e97511aa7e26;

        // Mint 1e25 of each to deployer
        (bool successA,) = address(mockA).call(abi.encodeWithSignature("mint(address,uint256)", deployer, 10000000000000000000000000));
        require(successA, "Mint A failed");

        (bool successB,) = address(mockB).call(abi.encodeWithSignature("mint(address,uint256)", deployer, 10000000000000000000000000));
        require(successB, "Mint B failed");

        vm.stopBroadcast();
    }
}