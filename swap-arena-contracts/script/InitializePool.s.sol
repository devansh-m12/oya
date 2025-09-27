// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {PositionManager} from "v4-periphery/src/PositionManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";

import {Constants} from "./base/Constants.sol";
import {Config} from "./base/Config.sol";
import {SwapArena} from "../src/SwapArena.sol";

contract InitializePoolScript is Script, Constants, Config {
    using CurrencyLibrary for Currency;

    // Pool configuration from previous setup
    uint24 lpFee = 3000;
    int24 tickSpacing = 60;
    uint160 startingPrice = 25052893676914917627943681377;

    // Addresses from previous deployment (override config)
    address myToken0 = 0x879647ed8d733Ab274E9513e0120fc111dD641fa; // MT0
    address myToken1 = 0xc88Dc7f8Bb7f931C47dF61aF5c365C409b2A8B9d; // MT1
    address swapArena = 0xc62a2207D15Dc7946e80694311767aE13d588040;

    function run() external {
        vm.startBroadcast();

        Currency localCurrency0 = Currency.wrap(myToken0);
        Currency localCurrency1 = Currency.wrap(myToken1);

        PoolKey memory pool = PoolKey({
            currency0: localCurrency0,
            currency1: localCurrency1,
            fee: lpFee,
            tickSpacing: tickSpacing,
            hooks: IHooks(address(swapArena))
        });

        // Initialize pool (only PoolKey and sqrtPriceX96)
        posm.initializePool(pool, startingPrice);

        vm.stopBroadcast();

        console.logBytes32(keccak256(abi.encode(pool)));
        console.log("Pool initialized successfully.");
    }
}