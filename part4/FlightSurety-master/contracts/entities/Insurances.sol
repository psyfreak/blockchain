// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;
/*
import "../../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
*/
import {Util} from "../base/Util.sol";


contract Insurances  {

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    uint256 public constant MAX_INSURANCE_FEE = 1 ether; //150 wei; //ether;

    // insurance
    struct Insurance {
        address passenger;
        uint256 insurance;
        bool deposited;
    }
    // mapping for passengers flight towards insurance balance / a passenger might have multiple insurances for different flights flight 1: 1 ether, flight 2: 0.6 ether etc.
    mapping(bytes32 => Insurance[]) insurances;// mapping of passenger towards Insurance Info (insurance balanace per flight)

    //mapping (address => PasInfo
    /*
     passenger{payout, insurances: flightKey => insurance
    */

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event InsurancePurchased(address indexed payee, uint256 weiAmount, bool deposited);
    event InsuranceDeposited(address indexed payee, uint256 weiAmount, uint256 balance, bool deposited);
    event InsuranceWithdrawn(address indexed payee, uint256 weiAmount, uint256 weiBalanceDataContractBefore, uint256 weiBalanceDataContractAfter);

    //event LogInsuranceIt(uint counter, address passenger, uint256 balance);

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/
    // TODO
    function getInsuranceByKey (bytes32 flightKey, address passenger)
        public
        view
        //requireIsPassengerOnFlight(flight, passenger)
        returns(address, uint256, bool)
    {
        uint len = insurances[flightKey].length;
        //TODO add modifier
        if (len > 0) {
            for(uint i=0; i<len; i++) {
                //emit LogInsuranceIt(i, insuranceOfFlight[i].passenger,insuranceOfFlight[i].insurance);
                // if passenger on the list and insurance is greater than 0
                if(insurances[flightKey][i].passenger == passenger) {
                    return (
                        insurances[flightKey][i].passenger,
                        insurances[flightKey][i].insurance,
                        insurances[flightKey][i].deposited
                    );
                }
            }
        }
        return  (address(0),0, false);
    }

    function getInsurance (address airline, string calldata flight, uint256 timestamp, address passenger)
    public
    view
    returns(address, uint256, bool)
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return getInsuranceByKey(flightKey, passenger);
    }

    function isPassengerInsuredByKey (bytes32 flight, address passenger)
        public
        view
        //requireIsPassengerOnFlight(flight, passenger)
        returns(bool)
    {
        // for loop  I need the possibility to iterate over all insured passenger for a flight therefore an array
        // TODO better we could also add insurance to passenger list to have direct access and only safe the address in the passenger array
        // check first if passenger is on flight at all

        bool found = false;
        Insurance[] storage insuranceOfFlight = insurances[flight];
        //insurances[flightKey].push(Insurance({passenger: passenger, insurance: msg.value}));
        // https://github.com/ethereum/solidity/issues/4115

        for(uint i=0; i<insuranceOfFlight.length; i++) {
            //emit LogInsuranceIt(i, insuranceOfFlight[i].passenger,insuranceOfFlight[i].insurance);
            // if passenger on the list and insurance is greater than 0
            if(
            //insuranceOfFlight[i].insurance > 0 &&
                (insuranceOfFlight[i].passenger == passenger)
            ) {
                found = true;
                break;
            }
        }
        return found;
    }

    function isPassengerInsured(address airline, string calldata flight, uint256 timestamp, address passenger)
        public
        view
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
        return insurances[flightKey];
    }
    */
    function getAmountOfFlightInsurees (address airline, string calldata flight, uint256 timestamp)
        public
        view
        returns(uint)
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        return insurances[flightKey].length;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

}