// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

import {BexClub} from "../src/BexClub.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";
contract SwapScript is Script {
   

    

    function run() external {
     
        vm.broadcast();
        IERC20  token1 = IERC20(address(0x5c602C98Ad2434c86D83f956bF3B22323dDe7f85));
        token1.approve(address(this), 0.00002 ether);
        
        vm.broadcast();
        BexClub club = new BexClub();
        vm.broadcast();
        token1.transfer(address(club), 0.00002 ether);
        vm.broadcast();
       


     
    }
}
