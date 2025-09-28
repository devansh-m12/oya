// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {PositionManager} from "v4-periphery/src/PositionManager.sol";
import {Actions} from "v4-periphery/src/libraries/Actions.sol";
import {LiquidityAmounts} from "v4-core/test/utils/LiquidityAmounts.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {IAllowanceTransfer} from "permit2/src/interfaces/IAllowanceTransfer.sol";
import "../src/Swapper.sol";

contract RealSwapScript is Script {

    function run() external {
        uint256 deployerPrivateKey = 0x532d47ed230175c188e5751ea656bd4b9da5c776104049440f297ae93a3abd5a;
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        IPoolManager poolManager = IPoolManager(0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408);
        PositionManager posm = PositionManager(payable(0x4B2C77d209D3405F41a037Ec6c77F7F5b8e2ca80));
        IAllowanceTransfer PERMIT2 = IAllowanceTransfer(0x000000000022D473030F116dDEE9F6B43aC78BA3);

        Swapper swapper = new Swapper(poolManager);

        PoolKey memory key = PoolKey({
            currency0: Currency.wrap(0x66cA625c58513A6D9C2ea2BaAf238E37d7ec585C),
            currency1: Currency.wrap(0x8C6FE43C7fddc5EeA6800fE6405A1575f038DC16),
            fee: 3000,
            tickSpacing: 60,
            hooks: IHooks(0x2Bf28F029258C7Fd57481eEeA1FA78662fb84040)
        });

        address token0Addr = Currency.unwrap(key.currency0);
        address token1Addr = Currency.unwrap(key.currency1);

        // Mint tokens to deployer for swap
        (bool success0,) = token0Addr.call(abi.encodeWithSignature("mint(address,uint256)", deployer, 0.00001 ether));
        require(success0, "Mint token0 failed");
        (bool success1,) = token1Addr.call(abi.encodeWithSignature("mint(address,uint256)", deployer, 0 ether));
        require(success1, "Mint token1 failed");

        // The pool is already initialized, skip initialize

        // Approve tokens to Permit2 and then to swapper
        IERC20(token0Addr).approve(address(PERMIT2), type(uint256).max);
        PERMIT2.approve(address(token0Addr), address(swapper), type(uint160).max, type(uint48).max);
        IERC20(token1Addr).approve(address(PERMIT2), type(uint256).max);
        PERMIT2.approve(address(token1Addr), address(swapper), type(uint160).max, type(uint48).max);

        // Transfer input tokens to swapper
        IERC20(token0Addr).transfer(address(swapper), 0.00001 ether);

        // Skip adding liquidity as it's already done

        IPoolManager.SwapParams memory swapParams = IPoolManager.SwapParams({
            zeroForOne: true, // Swap token0 for token1 (buy)
            amountSpecified: int256(0.00001 ether),
            sqrtPriceLimitX96: 4295128740
        });

        bytes memory hookData = "";
        swapper.swap(key, swapParams, hookData);

        vm.stopBroadcast();
    }
}
