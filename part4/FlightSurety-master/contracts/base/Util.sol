// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

/************************************************** */
/* FlightSurety Util library                        */
/************************************************** */
library Util {




// Create Util lib for such kind of functions
    function getFlightKey (
        address airline,
        string calldata flight,
        uint256 timestamp
    )
    pure
    internal
    returns(bytes32)
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    // Returns array of three non-duplicating integers from 0-9
    function generateIndexes (
        address account
    )
    internal
    view
    returns(uint8[3] memory)
    {
        uint8[3] memory indexes;
        uint8 seedVariationCounter = 0;
        indexes[0] = getRandomIndex10(account, seedVariationCounter);

        indexes[1] = indexes[0];
        while(indexes[1] == indexes[0]) {
            seedVariationCounter++;
            indexes[1] = getRandomIndex10(account, seedVariationCounter);

        }

        indexes[2] = indexes[1];
        while((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
            seedVariationCounter++;
            indexes[2] = getRandomIndex10(account, seedVariationCounter);
        }

        return indexes;
    }

    /**
     * Generate pseudo random number between >= 0 and < maxValue
     *
     **/
    function getRandomIndex (
        address seed,
        uint8 seedVariation,
        uint8 maxValue
    )
    internal
    view
    returns (uint8)
    {
        // change pseudo random so that no instance variable is needed and one can use it in a library
        if (seedVariation > 250) {
            seedVariation = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }
        // Pseudo random number...the incrementing nonce adds variation block.timestamps brings the variation for the first call, while seedVariation for consecutive calls
        uint8 random = uint8((uint256(keccak256(abi.encodePacked(blockhash(block.number - seedVariation), seed))) + block.timestamp) % maxValue);


        /*
        // no need for state variable which is also necessary if used as library function - no state
        // Pseudo random number...the incrementing nonce adds variation
        uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);
        if (nonce > 250) {
            nonce = 0;  // Can only fetch blockhashes for last 256 blocks so we adapt
        }
        */

        return random;
    }

    /**
      * Generate pseudo random number between 0 and 9
      * Code sugar for generic random index just with a fixed max value of 10
    **/
    function getRandomIndex10 (
        address seed,
        uint8 seedVariation
    )
    internal
    view
    returns (uint8)
    {
        return getRandomIndex(seed, seedVariation, 10);
    }
}