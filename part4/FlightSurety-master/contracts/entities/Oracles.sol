// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import {Util} from "../base/Util.sol";


contract Oracles  {

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    // Incremented to add pseudo-randomness at various points
    // no need anymore uint8 private nonce = 0;

    // Fee to be paid when registering oracle
    uint256 public constant ORACLE_REGISTRATION_FEE = 10 wei; //1 ether;
    // Number of oracles that must respond for valid status
    uint256 internal constant MIN_RESPONSES = 1; // should be 3

    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;
    }
    mapping(address => Oracle) internal oracles;

    uint8 public oracleCount = 0;// Track all registered oracles

    // Model for responses from oracles
    struct ResponseInfo {
        address requester;                              // Account that requested status
        bool isOpen;                                    // If open, oracle responses are accepted
        mapping(uint8 => address[]) responses;          // Mapping key is the status code reported
        // This lets us group responses and identify
        // the response that majority of the oracles
    }
    // Track all oracle responses
    // Key = hash(index, flight, timestamp)
    mapping(bytes32 => ResponseInfo) public oracleResponses;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    // Event fired each time an oracle submits a response
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);
    event OracleRegistered(address oracle, uint8[3] indexes, uint8 count);
    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);

    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function getMyIndexes()
        view
        external
        returns(uint8[3] memory)
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");

        return oracles[msg.sender].indexes;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

}