// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "./base/ERC721Metadata.sol";

//  TODO's: Create CustomERC721Token contract that inherits from the ERC721Metadata contract. You can name this contract as you please
//  1) Pass in appropriate values for the inherited ERC721Metadata contract
//      - make the base token uri: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/
//  2) create a public mint() that does the following:
//      -can only be executed by the contract owner
//      -takes in a 'to' address, tokenId, and tokenURI as parameters
//      -returns a true boolean upon completion of the function
//      -calls the superclass mint and setTokenURI functions
contract ERC721Mintable is ERC721Metadata {
    constructor(string memory name, string memory symbol)
        ERC721Metadata(name, symbol, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/") {

    }


    // mint(address to, uint256 tokenId)
    function mint (address to, uint256 tokenId)
    public
    {
        super._mint(to, tokenId);
    }
}


