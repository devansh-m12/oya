// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {Currency} from "v4-core/src/types/Currency.sol";

/// @notice Shared configuration between scripts
contract Config {
    /// @dev populated with default anvil addresses
    IERC20 constant token0 = IERC20(address(0x39C51817f9F82244F36b23B9c2ec73bA895f89E7)); // MOCKB (lower address)
    IERC20 constant token1 = IERC20(address(0x8A163E553b4c3bAFA610b83a3D564bF4ea3ACd57)); // MOCKA
    IHooks constant hookContract = IHooks(address(0xc62a2207D15Dc7946e80694311767aE13d588040)); // SwapArena

    Currency constant currency0 = Currency.wrap(address(token0));
    Currency constant currency1 = Currency.wrap(address(token1));
}
