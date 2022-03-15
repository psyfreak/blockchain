pragma solidity ^0.8.1;

import "../Oraclize.sol";
import './ERC721Enumerable.sol';

contract ERC721Metadata is ERC721Enumerable, usingOraclize {

    // TODO: Create private vars for token _name, _symbol, and _baseTokenURI (string)
    string private _name;
    string private _symbol;
    string private _baseTokenURI;

    // TODO: create private mapping of tokenId's to token uri's called '_tokenURIs'
    mapping(uint256 => string) private _tokenURIs;

    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    /*
     * 0x5b5e139f ===
     *     bytes4(keccak256('name()')) ^
     *     bytes4(keccak256('symbol()')) ^
     *     bytes4(keccak256('tokenURI(uint256)'))
     */
    constructor (string memory name, string memory symbol, string memory baseTokenURI) {
        // TODO: set instance var values
        _name = name;
        _symbol = symbol;
        _baseTokenURI = baseTokenURI;
        _registerInterface(_INTERFACE_ID_ERC721_METADATA);
    }

    // TODO: create external getter functions for name, symbol, and baseTokenURI

    //
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_exists(tokenId));
        return _tokenURIs[tokenId];
    }


    // TODO: Create an internal function to set the tokenURI of a specified tokenId
    // It should be the _baseTokenURI + the tokenId in string form
    // TIP #1: use strConcat() from the imported oraclizeAPI lib to set the complete token URI
    // TIP #2: you can also use uint2str() to convert a uint to a string
    // see https://github.com/oraclize/ethereum-api/blob/master/oraclizeAPI_0.5.sol for strConcat()
    // require the token exists before setting

}

