// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the library 'Roles'
import "../coffeeaccesscontrol/FarmerRole.sol";
import "../coffeeaccesscontrol/DistributorRole.sol";
import "../coffeeaccesscontrol/RetailerRole.sol";
import "../coffeeaccesscontrol/ConsumerRole.sol";

// Define a contract 'ConsumerRole' to manage this role - add, remove, check
contract Accessible is FarmerRole, DistributorRole, RetailerRole, ConsumerRole {
    constructor () { // internal

    }

    // Define a modifier that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address, "caller is not verified");
        _;
    }

}