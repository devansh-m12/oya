// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MockERC20} from "solmate/src/test/utils/mocks/MockERC20.sol";
import {PositionManager} from "v4-periphery/src/PositionManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";
import {Actions} from "v4-periphery/src/libraries/Actions.sol";
import {LiquidityAmounts} from "v4-core/test/utils/LiquidityAmounts.sol";
import {TickMath} from "v4-core/src/libraries/TickMath.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";

import {Constants} from "./base/Constants.sol";
import {Config} from "./base/Config.sol";
import {SwapArena} from "../src/SwapArena.sol";

contract SetupBexAndPoolScript is Script, Constants, Config {
    using CurrencyLibrary for Currency;

    // Pool configuration
    uint24 lpFee = 3000; // 0.30%
    int24 tickSpacing = 60;
    uint160 startingPrice = 25052893676914917627943681377; // floor(sqrt(100000) * 2^96)

    // Liquidity position configuration
    uint256 public token0Amount = 10000000e18;
    uint256 public token1Amount = 1000e18;
    int24 tickLower = -600;
    int24 tickUpper = 600;

    // Amounts to mint for liquidity and staking
    uint256 mintAmount = 1e25; // 10M tokens for each

    function run() external {
        vm.startBroadcast();

        // Deploy mock BEX coin
        MockERC20 bex = new MockERC20("BEX Coin", "BEX", 18);
        address bexCoin = address(bex);

        // Mint BEX to deployer for staking
        bex.mint(msg.sender, mintAmount * 10); // Extra for staking

        // Set BEX token on SwapArena
        SwapArena swapArena = SwapArena(0xc62a2207D15Dc7946e80694311767aE13d588040);
        swapArena.setToken(bexCoin);

        // Deploy mock tokens for pool
        MockERC20 token0Mock = new MockERC20("Mock Token 0", "MT0", 18);
        MockERC20 token1Mock = new MockERC20("Mock Token 1", "MT1", 18);

        // Mint tokens to deployer
        token0Mock.mint(msg.sender, mintAmount);
        token1Mock.mint(msg.sender, mintAmount);

        // Set currencies
        Currency currency0 = Currency.wrap(address(token0Mock));
        Currency currency1 = Currency.wrap(address(token1Mock));

        // Approvals for pool
        token0Mock.approve(address(PERMIT2), type(uint256).max);
        PERMIT2.approve(address(token0Mock), address(posm), type(uint160).max, type(uint48).max);
        token1Mock.approve(address(PERMIT2), type(uint256).max);
        PERMIT2.approve(address(token1Mock), address(posm), type(uint160).max, type(uint48).max);

        // Pool key with hook
        PoolKey memory pool = PoolKey({
            currency0: currency0,
            currency1: currency1,
            fee: lpFee,
            tickSpacing: tickSpacing,
            hooks: IHooks(address(swapArena)) // Attach SwapArena as hook
        });
        bytes memory hookData = "";

        // Calculate liquidity
        uint128 liquidity = LiquidityAmounts.getLiquidityForAmounts(
            startingPrice,
            TickMath.getSqrtPriceAtTick(tickLower),
            TickMath.getSqrtPriceAtTick(tickUpper),
            token0Amount,
            token1Amount
        );

        // Slippage
        uint256 amount0Max = token0Amount + 1;
        uint256 amount1Max = token1Amount + 1;

        // Actions for mint
        (bytes memory actions, bytes[] memory mintParams) = _mintLiquidityParams(
            pool, tickLower, tickUpper, liquidity, amount0Max, amount1Max, msg.sender, hookData
        );

        // Multicall params
        bytes[] memory params = new bytes[](2);
        params[0] = abi.encodeWithSelector(posm.initializePool.selector, pool, startingPrice, hookData);
        params[1] = abi.encodeWithSelector(posm.modifyLiquidities.selector, abi.encode(actions, mintParams), block.timestamp + 60);

        // Execute
        posm.multicall(params);

        vm.stopBroadcast();

        console.log("BEX Coin deployed at:", bexCoin);
        console.log("BEX minted to deployer:", mintAmount * 10);
        console.log("SwapArena BEX token set.");
        console.logBytes32(keccak256(abi.encode(pool)));
        console.log("Liquidity added:", uint256(liquidity));
        console.log("Token0 (MT0):", address(token0Mock));
        console.log("Token1 (MT1):", address(token1Mock));
    }

    function _mintLiquidityParams(
        PoolKey memory poolKey,
        int24 _tickLower,
        int24 _tickUpper,
        uint256 liquidity,
        uint256 amount0Max,
        uint256 amount1Max,
        address recipient,
        bytes memory hookData
    ) internal pure returns (bytes memory, bytes[] memory) {
        bytes memory actions = abi.encodePacked(uint8(Actions.MINT_POSITION), uint8(Actions.SETTLE_PAIR));

        bytes[] memory params = new bytes[](2);
        params[0] = abi.encode(poolKey, _tickLower, _tickUpper, liquidity, amount0Max, amount1Max, recipient, hookData);
        params[1] = abi.encode(poolKey.currency0, poolKey.currency1);
        return (actions, params);
    }
}