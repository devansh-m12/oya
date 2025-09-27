// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {IUnlockCallback} from "v4-core/src/interfaces/callback/IUnlockCallback.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

contract SwapCallback is IUnlockCallback {
    IPoolManager public immutable poolManager;

    constructor(IPoolManager _poolManager) {
        poolManager = _poolManager;
    }

    function swap(PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData) external returns (BalanceDelta delta) {
        poolManager.swap(key, params, hookData);
    }

    function unlockCallback(bytes calldata data) external override {
        require(msg.sender == address(poolManager), "not pool manager");

        (PoolKey memory key, IPoolManager.SwapParams memory params) = abi.decode(data, (PoolKey, IPoolManager.SwapParams));

        // Approve tokens for the pool manager
        if (params.zeroForOne) {
            Currency(key.currency0).transfer(poolManager, params.amountSpecified);
        } else {
            Currency(key.currency1).transfer(poolManager, params.amountSpecified);
        }
    }
}