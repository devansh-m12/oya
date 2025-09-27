// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {PositionManager} from "v4-periphery/src/PositionManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {Actions} from "v4-periphery/src/libraries/Actions.sol";
import {LiquidityAmounts} from "v4-core/test/utils/LiquidityAmounts.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";

import {Constants} from "./base/Constants.sol";
import {Config} from "./base/Config.sol";

contract AddLiquidityScript is Script, Constants, Config {
    using CurrencyLibrary for Currency;

    // Pool configuration from previous setup
    uint24 lpFee = 3000;
    int24 tickSpacing = 60;
    uint160 startingPrice = 25052893676914917627943681377;

    // Liquidity position configuration
    uint256 public token0Amount = 10000000e18;
    uint256 public token1Amount = 1000e18;
    int24 tickLower = -600;
    int24 tickUpper = 600;

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
        bytes memory hookData = "";

        // Calculate liquidity
        uint128 liquidity = LiquidityAmounts.getLiquidityForAmounts(
            startingPrice,
            TickMath.getSqrtPriceAtTick(tickLower),
            TickMath.getSqrtPriceAtTick(tickUpper),
            token0Amount,
            token1Amount
        );

        // Slippage
        uint256 amount0Max = token0Amount + 1;
        uint256 amount1Max = token1Amount + 1;

        // Actions for mint
        (bytes memory actions, bytes[] memory mintParams) = _mintLiquidityParams(
            pool, tickLower, tickUpper, liquidity, amount0Max, amount1Max, msg.sender, hookData
        );

        // Modify liquidities (add liquidity)
        posm.modifyLiquidities(abi.encode(actions, mintParams), block.timestamp + 60);

        vm.stopBroadcast();

        console.logBytes32(keccak256(abi.encode(pool)));
        console.log("Liquidity added:", uint256(liquidity));
    }

    function _mintLiquidityParams(
        PoolKey memory poolKey,
        int24 _tickLower,
        int24 _tickUpper,
        uint256 liquidity,
        uint256 amount0Max,
        uint256 amount1Max,
        address recipient,
        bytes memory hookData
    ) internal pure returns (bytes memory, bytes[] memory) {
        bytes memory actions = abi.encodePacked(uint8(Actions.MINT_POSITION), uint8(Actions.SETTLE_PAIR));

        bytes[] memory params = new bytes[](2);
        params[0] = abi.encode(poolKey, _tickLower, _tickUpper, liquidity, amount0Max, amount1Max, recipient, hookData);
        params[1] = abi.encode(poolKey.currency0, poolKey.currency1);
        return (actions, params);
    }
}