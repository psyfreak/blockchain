// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../coffeebase/SupplyChain.sol";

// FIXME use open zeppelin ownable implementation instead
//import "../coffeebase/SupplyChain.sol";

/// Provides basic authorization control
contract Ownable is SupplyChain {
    address private origOwner;

    // Define an Event
    event TransferOwnership(address indexed oldOwner, address indexed newOwner);

    /// Assign the contract to an owner
    constructor () { // internal
        origOwner = msg.sender;
        emit TransferOwnership(address(0), origOwner);
    }

    /// Look up the address of the owner
    function owner() public view returns (address) {
        return origOwner;
    }

    /// Define a function modifier 'onlyOwner'
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /// Check if the calling address is the owner of the contract
    function isOwner() public view returns (bool) {
        return msg.sender == origOwner;
    }

    /// Define a function to renounce ownerhip
    function renounceOwnership() public onlyOwner {
        origOwner = address(0);
        emit TransferOwnership(origOwner, address(0));
    }

    // FIXME moved from supplychain.sol
    // Define a function 'kill' if required
    function kill() public onlyOwner {
        /*
        // why not owner check
        if (msg.sender == owner) {
          address payable addr = payable(owner);
          selfdestruct(addr);
        }
        */
        address payable addr = payable(origOwner);
        selfdestruct(addr);
    }

    /// Define a public function to transfer ownership
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /// Define an internal function to transfer ownership
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        origOwner = newOwner;
        emit TransferOwnership(origOwner, newOwner);
    }

}