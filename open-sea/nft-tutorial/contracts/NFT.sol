// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

/**
 ERC721 basic implemention

 Step 3: https://docs.opensea.io/docs/part-3-adding-metadata-and-payments-to-your-contract
**/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;

    /// @dev Base token URI used as a prefix by tokenURI(). (e.g. https://my-nft-metadata.com/{token-id})
    string public baseTokenURI;

    constructor() ERC721("NFTTutorial", "NFT") {
        //
        baseTokenURI = "";
    }

    function mintTo(address recipient)
    public
    returns (uint256)
    {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        _safeMint(recipient, newItemId);
        return newItemId;
    }

    /// @dev Returns an URI for a given token ID
    function _baseURI() internal view virtual override returns (string memory) {
        /*
            An alternative strategy some developers use is to override the _baseURI() method to return
            a hard-coded string "https://your-token-metadata.com/metadata/".
            This allows you as the developer to save on gas by avoiding having to call setBaseTokenURI(),
            at the added restriction of not being able to change your metadata after it is deployed.
        */
        return baseTokenURI;
    }

    /*
        This addition to the contract will make it so that calling tokenURI() for any
        of our minted tokenIds will return the baseTokenURI + tokenId without any additional work on our end.
    */

    /// @dev Sets the base token URI prefix.
    function setBaseTokenURI(string memory _baseTokenURI) public {
        baseTokenURI = _baseTokenURI;
    }
}