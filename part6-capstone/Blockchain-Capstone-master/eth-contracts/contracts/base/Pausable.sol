pragma solidity ^0.8.1;

//  TODO's: Create a Pausable contract that inherits from the Ownable contract

import "./Ownable.sol";

//  4) create 'whenNotPaused' & 'paused' modifier that throws in the appropriate situation
//  5) create a Paused & Unpaused event that emits the address that triggered the event
contract Pausable is Ownable {
    //  TODO's
    //  1) create a private '_paused' variable of type bool
    bool private _paused;

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

    //  2) create a public setter using the inherited onlyOwner modifier
    function isPaused() public returns (bool) {
        return _paused;
    }


    modifier paused() {
        require(_paused, "Must be paused");
        _;
    }

    modifier whenNotPaused() {
        require(!_paused, "Must be not paused");
        _;
    }
}


