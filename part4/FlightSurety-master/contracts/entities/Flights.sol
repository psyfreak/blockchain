// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import {Util} from "../base/Util.sol";

contract Flights  {

    // flights
    struct Flight {
        uint256 id; // incrementing no.
        bool isRegistered; // registration went through
        uint8 status;
        address registeredBy;
        address[] passengers;
        // role //TODO one can do this with Access roles such as in prev. lesson
        //address wallet; // money might be store here
    }
    mapping(bytes32 => Flight) flights;
    uint256 public numOfFlights = 0;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event FlightRegistered(address airline, uint256 id, bool isRegistered, address registeredB, uint256 investment, uint256 timestamp);
    event FlightCreated(bytes32 flightKey, address origin, address airline);
    event FlightUpdated(bytes32 flightKey, uint8 newStatus);

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function getFlight (address airline, string calldata flight, uint256 timestamp)
        public
        view
        returns(
            uint256 ,
            bool,
            uint8,
            address,
            address[] memory
        )
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return (flights[flightKey].id, flights[flightKey].isRegistered, flights[flightKey].status, flights[flightKey].registeredBy, flights[flightKey].passengers);
    }

    //getInsuree

    function isFlightRegisteredByKey (bytes32 flight)
        public
        view
        returns(bool)
    {
        return (flights[flight].isRegistered);
    }

    function isFlightRegistered ( address airline, string calldata flight, uint256 timestamp)
        public
        view
        returns(bool)
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return isFlightRegisteredByKey(flightKey);
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/
    modifier requireIsFlightExisting(bytes32 flightKey)
    {
        require(isFlightRegisteredByKey(flightKey), "Flight is not existing, though it should .");
        _;
    }

    modifier requireIsFlightNotExisting(bytes32 flightKey)
    {
        require(!isFlightRegisteredByKey(flightKey), "Flight is existing, though it should not.");
        _;
    }
}