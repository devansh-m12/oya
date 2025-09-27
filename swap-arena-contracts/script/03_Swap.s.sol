// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";

interface IUnlockCallback {
    function unlockCallback(bytes calldata data) external;
}

contract Swapper is IUnlockCallback {
    IPoolManager public immutable poolManager;
    using CurrencyLibrary for Currency;

    constructor(IPoolManager _poolManager) {
        poolManager = _poolManager;
    }

    function swap(PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData) external returns (BalanceDelta delta) {
        bytes memory data = abi.encode(key, params, hookData);
        poolManager.unlock(data);
        return delta; // Delta is handled in callback
    }

    function unlockCallback(bytes calldata data) external override {
        require(msg.sender == address(poolManager), "Not PoolManager");

        (PoolKey memory key, IPoolManager.SwapParams memory params, bytes memory hookData) = abi.decode(data, (PoolKey, IPoolManager.SwapParams, bytes));

        BalanceDelta delta = poolManager.swap(key, params, hookData);

        // Settle deltas
        if (delta.amount0() < 0) {
            key.currency0.transfer(address(poolManager), uint256(-delta.amount0()));
        }
        if (delta.amount1() < 0) {
            key.currency1.transfer(address(poolManager), uint256(-delta.amount1()));
        }

        // Refund positive deltas
        if (delta.amount0() > 0) {
            key.currency0.transfer(msg.sender, uint256(delta.amount0()));
        }
        if (delta.amount1() > 0) {
            key.currency1.transfer(msg.sender, uint256(delta.amount1()));
        }
    }
}

contract RealSwapScript is Script {
    function run() external {
        vm.startBroadcast();

        IPoolManager poolManager = IPoolManager(0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408);
        Swapper swapper = new Swapper(poolManager);

        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(0x39C51817f9F82244F36b23B9c2ec73bA895f89E7),
            currency1: Currency.wrap(0x8A163E553b4c3bAFA610b83a3D564bF4ea3ACd57),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(0xc62a2207D15Dc7946e80694311767aE13d588040)
        });

        // Approve tokens to PoolManager for settle
        key.currency0.approve(address(poolManager), 1e18);
        key.currency1.approve(address(poolManager), 1e18);

        IPoolManager.SwapParams memory params = IPoolManager.SwapParams({
            zeroForOne: true, // Swap token0 for token1 (buy)
            amountSpecified: int256(1e18),
            sqrtPriceLimitX96: TickMath.MIN_SQRT_RATIO + 1
        });

        bytes memory hookData = "";
        swapper.swap(key, params, hookData);

        vm.stopBroadcast();
    }
}
