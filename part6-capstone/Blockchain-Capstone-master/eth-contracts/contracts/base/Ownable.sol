pragma solidity ^0.8.1;

contract Ownable {
    //  TODO's
    //  1) create a private '_owner' variable of type address with a public getter function
    address private _owner;
    //  5) create an event that emits anytime ownerShip is transferred (including in the constructor)
    event Transfer(address indexed from, address indexed to);

    //  2) create an internal constructor that sets the _owner var to the creator of the contract
    constructor(address owner) {
        _owner = owner;
    }

    //  4) fill out the transferOwnership function
    function transferOwnership(address newOwner)
    public
    onlyOwner
    onlyEOA
    {
        // TODO add functionality to transfer control of the contract to a newOwner.
        // make sure the new owner is a real address
        // EOA
        address oldOwner = _owner;
        _owner = newOwner;
        emit Transfer(oldOwner, newOwner);
    }

    //  3) create an 'onlyOwner' modifier that throws if called by any account other than the owner.
    modifier onlyOwner() {
        require(_owner == msg.sender, "Must be owner");
        _;
    }

    modifier onlyEOA() {
        require(msg.sender == tx.origin, "Must use EOA");
        _;
    }
}

