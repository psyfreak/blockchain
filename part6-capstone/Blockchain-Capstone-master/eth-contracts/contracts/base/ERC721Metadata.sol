// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "../Oraclize.sol";
import './ERC721Enumerable.sol';

contract ERC721Metadata is ERC721Enumerable, usingOraclize {

    // DONE TODO: Create private vars for token _name, _symbol, and _baseTokenURI (string)
    string private _name;
    string private _symbol;
    string private _baseTokenURI;

    // DONE TODO: create private mapping of tokenId's to token uri's called '_tokenURIs'
    mapping(uint256 => string) private _tokenURIs;

    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    /*
     * 0x5b5e139f ===
     *     bytes4(keccak256('name()')) ^
     *     bytes4(keccak256('symbol()')) ^
     *     bytes4(keccak256('tokenURI(uint256)'))
     */
    constructor (string memory nameTmp, string memory symbolTmp, string memory baseTokenURITmp) {
        // DONE TODO: set instance var values
        _name = nameTmp;
        _symbol = symbolTmp;
        _baseTokenURI = baseTokenURITmp;
        _registerInterface(_INTERFACE_ID_ERC721_METADATA);
    }

    function tokenURI(uint256 tokenId)
        external view returns (string memory)
    {
        require(_exists(tokenId));
        return _tokenURIs[tokenId];
    }
    // DONE TODO: create external getter functions for name, symbol, and baseTokenURI
    function baseTokenURI()
        external view returns (string memory)
    {
        return _baseTokenURI;
    }

    function name()
        external view returns (string memory)
    {
        return _name;
    }

    function symbol()
        external view returns (string memory)
    {
        return _symbol;
    }

    // DONE TODO: Create an internal function to set the tokenURI of a specified tokenId
    // It should be the _baseTokenURI + the tokenId in string form
    // TIP #1: use strConcat() from the imported oraclizeAPI lib to set the complete token URI
    // TIP #2: you can also use uint2str() to convert a uint to a string
    // see https://github.com/oraclize/ethereum-api/blob/master/oraclizeAPI_0.5.sol for strConcat()
    // require the token exists before setting
    function setTokenURI(uint256 tokenId)
    internal
    {
        //counter of token to string uint2str()
        string memory tokenIdStr = uint2str(tokenId);
        string memory currentTokenURI = strConcat(_baseTokenURI, tokenIdStr);
        // require the token exists before setting
        require(_exists(tokenId), "Token does not exist");
        //strConcat() to set the complete token URI baseTokenURI + tokenId
        _tokenURIs[tokenId] = currentTokenURI;
    }
}

