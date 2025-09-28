// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IPositionManager} from "v4-periphery/src/interfaces/IPositionManager.sol";
import {LiquidityAmounts} from "v4-core/test/utils/LiquidityAmounts.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {StateLibrary} from "v4-core/src/libraries/StateLibrary.sol";
import {Actions} from "v4-periphery/src/libraries/Actions.sol";

import {Constants} from "./base/Constants.sol";
import {Config} from "./base/Config.sol";

contract AddLiquidityScript is Script, Constants, Config {
    using CurrencyLibrary for Currency;
    using StateLibrary for IPoolManager;

    /////////////////////////////////////
    // --- Parameters to Configure --- //
    /////////////////////////////////////

    // --- pool configuration --- //
    // fees paid by swappers that accrue to liquidity providers
    uint24 lpFee = 3000; // 0.30%
    int24 tickSpacing = 60;

    // --- liquidity position configuration --- //
    uint256 public token0Amount = 1000e18;
    uint256 public token1Amount = 1000e18;

    // range of the position
    int24 tickLower = -600; // must be a multiple of tickSpacing
    int24 tickUpper = 600;
    /////////////////////////////////////

    function run() external {
        PoolKey memory pool = PoolKey({
            currency0: currency0,
            currency1: currency1,
            fee: lpFee,
            tickSpacing: tickSpacing,
            hooks: hookContract
        });

        (uint160 sqrtPriceX96,,,) = POOLMANAGER.getSlot0(pool.toId());

        // Converts token amounts to liquidity units
        uint128 liquidity = LiquidityAmounts.getLiquidityForAmounts(
            sqrtPriceX96,
            TickMath.getSqrtPriceAtTick(tickLower),
            TickMath.getSqrtPriceAtTick(tickUpper),
            token0Amount,
            token1Amount
        );

        // slippage limits
        uint256 amount0Max = token0Amount + 1 wei;
        uint256 amount1Max = token1Amount + 1 wei;

        bytes memory hookData = new bytes(0);

        vm.startBroadcast();
        tokenApprovals();
        vm.stopBroadcast();

        vm.startBroadcast();

        // Mint additional tokens to deployer
        address deployer = 0x26d04a4c173b04a47Bb7ec74D3A2e97511aa7e26;
        (bool success0,) = Currency.unwrap(currency0).call(abi.encodeWithSignature("mint(address,uint256)", deployer, token0Amount));
        require(success0, "Mint token0 failed");
        (bool success1,) = Currency.unwrap(currency1).call(abi.encodeWithSignature("mint(address,uint256)", deployer, token1Amount));
        require(success1, "Mint token1 failed");

        tokenApprovals();
        vm.stopBroadcast();

        vm.startBroadcast();
        // Remove unused variable
        uint256 valueToPass = currency0.isAddressZero() ? amount0Max : 0;
        bytes[] memory params = new bytes[](2);
        params[0] = abi.encode(pool, tickLower, tickUpper, liquidity, amount0Max, amount1Max, 0x26d04a4c173b04a47Bb7ec74D3A2e97511aa7e26, hookData);
        params[1] = abi.encode(currency0, currency1);
        IPositionManager(address(posm)).modifyLiquidities{value: valueToPass}(
            abi.encode(abi.encodePacked(uint8(Actions.MINT_POSITION), uint8(Actions.SETTLE_PAIR)), params),
            block.timestamp + 60
        );
        vm.stopBroadcast();
    }

    function tokenApprovals() public {
        if (!currency0.isAddressZero()) {
            token0.approve(address(PERMIT2), type(uint256).max);
            PERMIT2.approve(address(token0), address(posm), type(uint160).max, type(uint48).max);
        }
        if (!currency1.isAddressZero()) {
            token1.approve(address(PERMIT2), type(uint256).max);
            PERMIT2.approve(address(token1), address(posm), type(uint160).max, type(uint48).max);
        }
    }
}
