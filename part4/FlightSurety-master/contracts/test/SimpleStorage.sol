// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

contract SimpleStorage {
    uint256 public storedData;

    address public caller;

    function set(uint256 x) public {
        caller = msg.sender;
        storedData = x;
    }
}