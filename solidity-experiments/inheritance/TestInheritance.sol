// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.7;

// Define a contract 'Lemonade Stand'
import "./LemonadeStand.sol";

contract TestInheritance is LemonadeStand("o") {
    string base;
    
    constructor() {
        base = "jo";
    }
    
}