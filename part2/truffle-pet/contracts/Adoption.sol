pragma solidity ^0.5.0;

contract Adoption {

    // store
    address[16] public adopters;

    // Adopting a pet
    function adopt(uint petId) public returns (uint) {

        require(petId >= 0 && petId <= 15);

        // The address of the person or smart contract who called this function is denoted by msg.sender
        adopters[petId] = msg.sender;

        return petId;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }
}