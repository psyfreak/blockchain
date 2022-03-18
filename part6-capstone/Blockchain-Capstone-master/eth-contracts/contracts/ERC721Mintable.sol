// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "./base/ERC721Metadata.sol";

//  DONE TODO's: Create CustomERC721Token contract that inherits from the ERC721Metadata contract. You can name this contract as you please
//  1) Pass in appropriate values for the inherited ERC721Metadata contract
//      - make the base token uri: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/

contract ERC721Mintable is ERC721Metadata {
    constructor(string memory name, string memory symbol)
        ERC721Metadata(name, symbol, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/")
    {

    }

    //  2) create a public mint() that does the following:
    //      -can only be executed by the contract owner
    //      -takes in a 'to' address, tokenId, // this is correct , it is already set via ctor ---- and tokenURI as parameters
    //      -returns a true boolean upon completion of the function
    //      -calls the superclass mint // this is not correct, it is already set via ctor - and setTokenURI functions
    // mint(address to, uint256 tokenId)
    function mint (address to, uint256 tokenId)
        public
        onlyOwner
        returns (bool)
    {
        _mint(to, tokenId); // if openzeppelin use _safeMint(to, tokenId); instead
        setTokenURI(tokenId);
        return true;
    }
}


