// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;
/*
import "../../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
*/
import {Util} from "../base/Util.sol";


contract Passengers  {



    // passenger quick detetion if passenger is on flight
    mapping(bytes32 => mapping(address=>bool)) passengers;

    // insurance
    struct Insurance {
        address passenger;
        uint256 insurance;
    }
    // mapping for passengers flight towards insurance balance / a passenger might have multiple insurances for different flights flight 1: 1 ether, flight 2: 0.6 ether etc.
    mapping(bytes32 => Insurance[]) flightInsurances;// mapping of passenger towards Insurance Info (insurance balanace per flight)

    // payouts
    mapping(address => uint256) public payouts; // after oracle submission payout is aggregated 1.5 times insurance flight value;


    event PassengerRegistered(bytes32 flightKey, address origin, address passenger);
    event InsurancePurchased(address indexed payee, uint256 weiAmount);
    event InsuranceDeposited(address indexed payee, uint256 weiAmount);
    event InsuranceWithdrawn(address indexed payee, uint256 weiAmount, uint256 weiBalanceDataContractBefore, uint256 weiBalanceDataContractAfter);

    event LogInsuranceIt(uint counter, address passenger, uint256 balance);



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


    // TODO
    function getInsuranceByKey (bytes32 flightKey, address passenger)
    public
    view
        //requireIsPassengerOnFlight(flight, passenger)
    returns(address, uint256)
    {
        //TODO add modifier
        if (flightInsurances[flightKey].length >0) {
            return (
            flightInsurances[flightKey][0].passenger,
            flightInsurances[flightKey][0].insurance
            );
        } else {
            return  (address(0),0);
        }
    }

    function getInsurance (
        address airline,
        string calldata flight,
        uint256 timestamp,
        address passenger
    )
    public
    view
    returns(address, uint256)
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return getInsuranceByKey(flightKey, passenger);
    }

    function isPassengerInsuredByKey (bytes32 flight, address passenger)
    public
        //view
        //requireIsPassengerOnFlight(flight, passenger)
    returns(bool)
    {
        // for loop  I need the possibility to iterate over all insured passenger for a flight therefore an array
        // TODO better we could also add insurance to passenger list to have direct access and only safe the address in the passenger array
        // check first if passenger is on flight at all

        bool found = false;
        Insurance[] storage insuranceOfFlight = flightInsurances[flight];
        //flightInsurances[flightKey].push(Insurance({passenger: passenger, insurance: msg.value}));
        // https://github.com/ethereum/solidity/issues/4115

        for(uint i=0; i<insuranceOfFlight.length; i++) {
            emit LogInsuranceIt(i, insuranceOfFlight[i].passenger,insuranceOfFlight[i].insurance);
            // if passenger on the list and insurance is greater than 0
            if(
            //insuranceOfFlight[i].insurance > 0 &&
                (insuranceOfFlight[i].passenger == passenger)
            ) {
                found = true;
                break;
            }
        }
        /*
        for(uint i=0; i<flightInsurances[flight].length; i++) {
            emit LogInsuranceIt(i, flightInsurances[flight][i].passenger, flightInsurances[flight][i].insurance);
            // if passenger on the list and insurance is greater than 0
            if(
                flightInsurances[flight][i].insurance > 0 &&
                (flightInsurances[flight][i].passenger == passenger)
            ) {
                found = true;
                break;
            }
        }
        */
        return found;
    }

    function isPassengerInsured (
        address airline,
        string calldata flight,
        uint256 timestamp,
        address passenger
    )
    public
        //view
    returns(bool)
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return isPassengerInsuredByKey(flightKey, passenger);
    }

    /*
    function getInsuredPassengersForFlight (
        address airline,
        string calldata flight,
        uint256 timestamp
    )
    public
    view
    returns(Insurance[] calldata)
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return flightInsurances[flightKey];
    }
    */
    function getAmountOfFlightInsurees (
        address airline,
        string calldata flight,
        uint256 timestamp
    )
    public
    view
    returns(uint)
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return flightInsurances[flightKey].length;
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