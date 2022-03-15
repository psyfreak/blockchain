// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

//  TODO's: Create a Pausable contract that inherits from the Ownable contract

import "./Ownable.sol";

contract Pausable is Ownable {
    //  TODO's
    //  1) create a private '_paused' variable of type bool
    bool private _paused;

    //  5) create a Paused & Unpaused event that emits the address that triggered the event
    event Paused(address indexed from);
    event Unpaused(address indexed from);

    //  3) create an internal constructor that sets the _paused variable to false
    constructor() Ownable(msg.sender)  {
        _paused = false;
    }

    //  2) create a public setter using the inherited onlyOwner modifier
    function setPaused(bool mode) public onlyOwner {
        _paused = mode;
        if(mode) {
            emit Paused(msg.sender);
        }
        else {
            emit Unpaused(msg.sender);
        }
    }

    function isPaused() public view returns (bool) {
        return _paused;
    }

    //  4) create 'whenNotPaused' & 'paused' modifier that throws in the appropriate situation
    modifier paused() {
        require(isPaused(), "Must be paused");
        _;
    }

    modifier whenNotPaused() {
        require(!isPaused(), "Must be not paused");
        _;
    }
}


