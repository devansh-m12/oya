// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";

interface IUnlockCallback {
    function unlockCallback(bytes calldata data) external;
}

contract Swapper is IUnlockCallback {
    IPoolManager public immutable poolManager;
    using CurrencyLibrary for Currency;

    constructor(IPoolManager _poolManager) {
        poolManager = _poolManager;
    }

    function swap(PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData) external {
        bytes memory data = abi.encode(key, params, hookData);
        poolManager.unlock(data);
    }

    function unlockCallback(bytes calldata data) external override {
        require(msg.sender == address(poolManager), "Not PoolManager");

        (PoolKey memory key, IPoolManager.SwapParams memory params, bytes memory hookData) = abi.decode(data, (PoolKey, IPoolManager.SwapParams, bytes));

        BalanceDelta delta = poolManager.swap(key, params, hookData);

        int128 amount0 = delta.amount0();
        int128 amount1 = delta.amount1();

        // Settle negative deltas (pay)
        if (amount0 < 0) {
            Currency input0 = key.currency0;
            poolManager.sync(input0);
            int256 pay0 = -int256(amount0);
            CurrencyLibrary.transfer(input0, address(poolManager), uint256(pay0));
            poolManager.settle();
        }
        if (amount1 < 0) {
            Currency input1 = key.currency1;
            poolManager.sync(input1);
            int256 pay1 = -int256(amount1);
            CurrencyLibrary.transfer(input1, address(poolManager), uint256(pay1));
            poolManager.settle();
        }

        // Take positive deltas (receive)
        if (amount0 > 0) {
            int256 rec0 = int256(amount0);
            poolManager.take(key.currency0, address(this), uint256(rec0));
        }
        if (amount1 > 0) {
            int256 rec1 = int256(amount1);
            poolManager.take(key.currency1, address(this), uint256(rec1));
        }
    }
}