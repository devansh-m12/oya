// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {IUnlockCallback} from "v4-core/src/interfaces/callback/IUnlockCallback.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SwapRouter is IUnlockCallback {
    IPoolManager public immutable poolManager;

    constructor(IPoolManager _poolManager) {
        poolManager = _poolManager;
    }

    function swap(
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external {
        Currency inputCurrency = params.zeroForOne ? key.currency0 : key.currency1;
        uint256 amount = uint256(params.amountSpecified);
        IERC20(CurrencyLibrary.unwrap(inputCurrency)).transferFrom(msg.sender, address(this), amount);

        bytes memory data = abi.encode(key, params, hookData);
        poolManager.unlock(data);
    }

    function unlockCallback(bytes calldata data) external override returns (bytes memory) {
        require(msg.sender == address(poolManager), "not pool manager");

        (PoolKey memory key, IPoolManager.SwapParams memory params, bytes memory hookData) = abi.decode(data, (PoolKey, IPPoolManager.SwapParams, bytes));

        poolManager.swap(key, params, hookData);

        // Refund excess input if any
        if (params.amountSpecified > 0) {
            Currency inputCurrency = params.zeroForOne ? key.currency0 : key.currency1;
            uint256 inputBalance = IERC20(CurrencyLibrary.unwrap(inputCurrency)).balanceOf(address(this));
            if (inputBalance > 0) {
                IERC20(CurrencyLibrary.unwrap(inputCurrency)).transfer(msg.sender, inputBalance);
            }
        }

        return "";
    }
}