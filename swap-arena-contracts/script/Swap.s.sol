// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {UniswapV4SwapTry} from "../src/Swap.sol";

contract SwapContractScript is Script {
    IPoolManager manager = IPoolManager(address(0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408));

    function run() external {
            vm.broadcast();
            new UniswapV4SwapTry(manager);
    }
}