// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

/// @notice Shared configuration between scripts
contract Config {
    /// @dev populated with default anvil addresses
    IERC20 constant token0 = IERC20(address(0x31b759A0d6d643cb4e4D5228764673527C2a5A20));
    IERC20 constant token1 = IERC20(address(0x3B9521b8D2e9CD00bC63B19813B05D1Bf362716e));
    IHooks constant hookContract = IHooks(address(0x0BFcD3FEF3142c66E8F563086333BF30d7788040));

    Currency constant currency0 = Currency.wrap(address(token0));
    Currency constant currency1 = Currency.wrap(address(token1));
}
