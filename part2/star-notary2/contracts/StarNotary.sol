pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

/*
// Either directly specify in the inheritance list...
contract Derived1 is ERC721("star", "st") {
    constructor() {}
}
// OR
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}
*/

// initialization either via first sample or in migration file.
//contract StarNotary is ERC721("test","jo") {

contract StarNotary is ERC721 {

    struct Star {
        string name;
    }

    mapping(uint256 => Star) public tokenIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */


    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't owned");
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public  payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        // msg sender is the buyer, and therefore not the owner of the contract, which is necessary for the transferFrom function
        // we need approve
        //transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use transferFrom
        _transfer(ownerAddress, msg.sender, _tokenId);
        address payable ownerAddressPayable = payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        // if wired too much return to newOwner aka msg.sender
        if(msg.value > starCost) {
            address payable newOwnerAddressPayable = payable(msg.sender);
            newOwnerAddressPayable.transfer(msg.value - starCost);
        }
        // star is not for sale anymore...
        starsForSale[_tokenId] = 0;
    }

}
