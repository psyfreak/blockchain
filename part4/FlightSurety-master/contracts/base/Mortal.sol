// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// FIXME in general we could define Mortal is ownable => but this is cleaner
// Provides basic mortality control
contract Mortal {
    address private creator;

    // Assign the contract to the initial creator
    constructor () { // internal
        creator = msg.sender;
    }

    // FIXME moved from supplychain.sol
    // Define a function 'kill' if required
    function kill() public {
        // only allow this action if the account sending the signal is the creator
        if (msg.sender == creator) {
            address payable addr = payable(creator);
            // kills this contract and sends remaining funds back to creator
            selfdestruct(addr);
        }
    }

    /// Look up the address of the owner
    function killer() public view returns (address) {
        return creator;
    }

}
