// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

/// @notice Shared configuration between scripts
contract Config {
    /// @dev populated with default anvil addresses
    IERC20 constant token0 = IERC20(address(0x66cA625c58513A6D9C2ea2BaAf238E37d7ec585C)); // MOCKA (lower address)
    IERC20 constant token1 = IERC20(address(0x8C6FE43C7fddc5EeA6800fE6405A1575f038DC16)); // MOCKB
    IHooks constant hookContract = IHooks(address(0x2Bf28F029258C7Fd57481eEeA1FA78662fb84040)); // SwapArena

    Currency constant currency0 = Currency.wrap(address(token0));
    Currency constant currency1 = Currency.wrap(address(token1));
}
