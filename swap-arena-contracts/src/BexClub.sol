// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;


import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
import {IPositionManager} from "v4-periphery/src/interfaces/IPositionManager.sol";
import {LiquidityAmounts} from "v4-core/test/utils/LiquidityAmounts.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";

import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {StateLibrary} from "v4-core/src/libraries/StateLibrary.sol";
import {EasyPosm} from "../test/utils/EasyPosm.sol";
import {Constants} from "../script/base/Constants.sol";
import {Config} from "../script/base/Config.sol";

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {BalanceDelta, BalanceDeltaLibrary} from "v4-core/src/types/BalanceDelta.sol";

contract BexClub is  Constants, Config{
    using CurrencyLibrary for Currency;
    using EasyPosm for IPositionManager;
    using StateLibrary for IPoolManager;
    using BalanceDeltaLibrary for BalanceDelta;

    // slippage tolerance to allow for unlimited price impact
    uint160 public constant MIN_PRICE_LIMIT = TickMath.MIN_SQRT_PRICE + 1;
    uint160 public constant MAX_PRICE_LIMIT = TickMath.MAX_SQRT_PRICE - 1;

    // IERC20 constant token0 = IERC20(address(0));
    // IERC20 constant token1 = IERC20(address(0x5c602C98Ad2434c86D83f956bF3B22323dDe7f85));
    // IHooks constant hookContract = IHooks(address(0xcE7e5Acc2e1c3095B52846cf07bAfA1b88540040));

    // Currency constant currency0 = Currency.wrap(address(token0));
    // Currency constant currency1 = Currency.wrap(address(token1));

    uint24 lpFee = 3000; // 0.30%
    int24 tickSpacing = 60;

    // range of the position
    int24 tickLower = -600; // must be a multiple of tickSpacing
    int24 tickUpper = 600;

    event  AddedLiquidity(uint256, int256, int256);

    function addLiquidity(uint256 token1Amount) external payable  {
        

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
            msg.value,
            token1Amount
        );

        // slippage limits
        uint256 amount0Max = msg.value + 1 wei;
        uint256 amount1Max = token1Amount + 1 wei;

        bytes memory hookData = new bytes(0);

       
        tokenApprovals();
        

        (uint256 i, BalanceDelta data)= IPositionManager(address(posm)).mint(
            pool, tickLower, tickUpper, liquidity, amount0Max, amount1Max, msg.sender, block.timestamp + 60, hookData
        );

        emit AddedLiquidity(i, data.amount0(), data.amount1());
    
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