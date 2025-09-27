// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// import "forge-std/Test.sol";

// import {Hooks} from "v4-core/src/libraries/Hooks.sol";
// import {TickMath} from "v4-core/src/libraries/TickMath.sol";
// import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
// import {PoolKey} from "v4-core/src/types/PoolKey.sol";
// import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
// import {PoolIdLibrary} from "v4-core/src/types/PoolId.sol";
// import {CurrencyLibrary, Currency} from "v4-core/src/types/Currency.sol";

// import {Fixtures} from "./utils/Fixtures.sol";

// import {SwapArena} from "../src/SwapArena.sol"; // Update path if necessary

// contract SwapArenaTest is Test, Fixtures {
//     using PoolIdLibrary for PoolKey;
//     using CurrencyLibrary for Currency;

//     Currency token0;
//     Currency token1;
//     Currency rewardToken;

//     SwapArena public hook;

//     function setUp() public {
//         deployFreshManagerAndRouters();
//         (token0, token1) = deployMintAndApprove2Currencies();
//         rewardToken = deployMintAndApproveCurrency();

//         uint160 flags = uint160(Hooks.AFTER_SWAP_FLAG);
//         address hookAddress = address(flags);

//         deployCodeTo(
//             "SwapArena.sol",
//             abi.encode(manager, Currency.unwrap(rewardToken)),
//             hookAddress
//         );

//         hook = SwapArena(hookAddress);

//         // Approve the hook to spend the tokens
//         MockERC20(Currency.unwrap(token0)).approve(address(hook), type(uint256).max);
//         MockERC20(Currency.unwrap(token1)).approve(address(hook), type(uint256).max);

//         (key, ) = initPool(token0, token1, hook, 3000, SQRT_PRICE_1_1);

//         // Add liquidity in different ranges
//         modifyLiquidityRouter.modifyLiquidity(
//             key,
//             ModifyLiquidityParams({
//                 tickLower: -120,
//                 tickUpper: 120,
//                 liquidityDelta: 10 ether,
//                 salt: bytes32(0)
//             }),
//             ZERO_BYTES
//         );
//     }

   

   
// }
