// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;
/*
import "../../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
*/
import {Util} from "../base/Util.sol";


contract Passengers  {
    // passenger quick detetion if passenger is on flight
    mapping(bytes32 => mapping(address=>bool)) passengers;

    // payouts
    mapping(address => uint256) public payouts; // after oracle submission payout is aggregated 1.5 times insurance flight value;

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

    function isPassengerRegistered (
        address airline,
        string calldata flight,
        uint256 timestamp,
        address passenger
    )
    public
    view
    returns(bool)
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return isPassengerRegisteredByKey(flightKey, passenger);
    }

    // TODO get my payout only add to app
    function getPayoutForInsuree (
        address passenger
    )
    public
    view
    returns(uint256)
    {
        return payouts[passenger];
    }



    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/
    modifier requireIsPassengerOnFlight(bytes32 flightKey, address passenger)
    {
        require(isPassengerRegisteredByKey(flightKey, passenger), "Passenger is not on board, though it should .");
        _;
    }
    modifier requireIsPassengerNotOnFlight(bytes32 flightKey, address passenger)
    {
        require(!isPassengerRegisteredByKey(flightKey, passenger), "Passenger is already on board, though it should not.");
        _;
    }


}