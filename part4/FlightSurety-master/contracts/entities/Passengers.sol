// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import {Util} from "../base/Util.sol";

contract Passengers  {

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    // balances for passengers with past insurance credits
    mapping(address => uint256) public balances; // after oracle submission payout is aggregated 1.5 times insurance flight value;

    // passenger quick detection if passenger is on flight (flight key to passenger)
    mapping(bytes32 => mapping(address=>bool)) passengers;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event PassengerRegistered(bytes32 flightKey, address origin, address passenger);

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/
    function isPassengerRegisteredByKey (bytes32 flight, address passenger)
        public
        view
        returns(bool)
    {
        return (passengers[flight][passenger]);
    }

    function isPassengerRegistered (address airline, string calldata flight, uint256 timestamp, address passenger)
        public
        view
        returns(bool)
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return isPassengerRegisteredByKey(flightKey, passenger);
    }

    // TODO get my payout only add to app
    function getPayoutForInsuree (address passenger)
        public
        view
        returns(uint256)
    {
        return balances[passenger];
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/
    modifier requireIsPassengerOnFlight(bytes32 flightKey, address passenger)
    {
        require(isPassengerRegisteredByKey(flightKey, passenger), "Passenger is not on board");
        _;
    }
    modifier requireIsPassengerNotOnFlight(bytes32 flightKey, address passenger)
    {
        require(!isPassengerRegisteredByKey(flightKey, passenger), "Passenger is already on board");
        _;
    }
}