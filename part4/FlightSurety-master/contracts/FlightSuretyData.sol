// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import "../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import {Util} from "./base/Util.sol";

import "./base/Authentication.sol";

// Entities
import "./entities/Airlines.sol";
import "./entities/Passengers.sol";
import "./entities/Flights.sol";

//import 'openzeppelin-solidity/contracts/payment/escrow/Escrow.sol';
/*
 add open zeppelin ownable
 add open zeppelin access
*/

contract FlightSuretyData is Ownable, Airlines, Flights, Passengers {
    using SafeMath for uint256;

    //Result is 2, all integer divison rounds DOWN to the nearest integer
    uint256 public constant VOTING_THRESHOLD = 4; //1.5 but solidity cannot use fractionals;

    // RoI is 3/2 => 1.5 => solidity cannot calculate with decimals and still rounding is applied.
    uint256 public constant ROI_NOMINATOR = 3;
    uint256 public constant ROI_DENOMINATOR = 2;


    uint256 public constant MAX_INSURANCE_FEE = 150 wei; //ether;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    bool public initialized = false; // own initialization function instead of ctor usage

    //Escrow escrow;
    mapping(address => bool) private authorizedCallers;
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false

     // Track all oracle responses
    // Key = hash(index, flight, timestamp)
    //mapping(bytes32 => ResponseInfo) private insurancesPaidPerPassenger;


    // mapping(registration => struct(mapping(address=>bool), votes voter,
    /*
        registration per airline
    */
    //votations[airline] = struct(array[airlines])
    // TODO might transfer to modular contract
    enum ElectionTopics { AIRLINE_REGISTRATION, SET_OPERATIONAL }

    mapping(ElectionTopics => mapping(address => address[])) public ballots;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event CallerAuthorized(address caller);
    event CallerDeauthorized(address caller);

    // TODO use airlines ctor for initialization
    event ContractFunded(address sender, uint256 investment);

    event BalanceChanged(uint256 balanceApp, uint256 balanceData);

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor ( address firstAirline) // not needed if init function
        payable // needed if we fund directly via ctor call
    {
        authorizedCallers[owner()] = true;// initialize so that contractOwner can register first airline
        //authorizedCallers[firstAirline] = true;
        //escrow = new Escrow();
        // authorize caller firs
        // so that we are able to create register and fund an airline via deploy script
        // one could also do it here directly in the data structure
        numOfAirlines = numOfAirlines.add(1);
        numOfRegisteredAirlines = numOfRegisteredAirlines.add(1);
        numOfFundedAirlines = numOfFundedAirlines.add(1);
        //done in funded method which is called in deploy script - numOfFundedAirlines = numOfFundedAirlines.add(1);

        //Airline memory newAirline = // also different here due to payable fct.
        airlines[firstAirline] = Airline({id:numOfAirlines, isRegistered: true, investment: msg.value, registeredBy: owner(), timestamp: block.timestamp});
        // fire event newAirline
        emit AirlineRegistered (
            firstAirline,
            airlines[firstAirline].id,
            airlines[firstAirline].isRegistered,
            airlines[firstAirline].registeredBy,
            airlines[firstAirline].investment,
            airlines[firstAirline].timestamp
        );

        // we could add fundAirline here as well
    }

/*
    /////////////////// now initialization via payable ctor - funding is done as well
    function initialize
    (
        address airlineAddr
    )
    external
    payable
    requireIsOperational
    //IsFeeSufficientChangeBack(AIRLINE_REGISTRATION_FEE)
    {
        require(!initialized, "Contract has already been initialized");
        initialized = true;

        authorizedCallers[airlineAddr] = true;
        numOfAirlines = numOfAirlines.add(1);
        numOfRegisteredAirlines = numOfRegisteredAirlines.add(1);
        //done in funded method which is called in deploy script - numOfFundedAirlines = numOfFundedAirlines.add(1);

        //Airline memory newAirline =
        airlines[airlineAddr] = Airline({id:numOfAirlines, isRegistered: true, investment: 0, registeredBy: tx.origin, timestamp: block.timestamp});
        // fire event newAirline
        emit AirlineRegistered (
            airlineAddr,
            airlines[airlineAddr].id,
            airlines[airlineAddr].isRegistered,
            airlines[airlineAddr].registeredBy,
            airlines[airlineAddr].investment,
            airlines[airlineAddr].timestamp
        );

    }
*/
    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */

    modifier requireIsOperational()
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    modifier GiveChangeBack(uint _amount) {
        _;
        if (msg.value > _amount) {
            payable(msg.sender).transfer(msg.value - _amount);
        }
    }


    modifier requireIsCallerAuthorized()
    {
        require(isCallerAuthorized(msg.sender), "Caller is not authorized");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
        public
        view
        returns(bool)
    {
        return operational;
    }

    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus(bool mode)
        external
        requireIsCallerAuthorized
        //onlyOwner
    {
        operational = mode;
    }

    function isCallerAuthorized(address caller)
        public
        view
        returns(bool)
    {
        return authorizedCallers[caller];
    }


    function authorizeCaller (address callee)
        external
        onlyOwner
    {
        // TODO add multisig voting mechanism
        authorizedCallers[callee] = true;
        emit CallerAuthorized(callee);
    }

    function deauthorizeCaller (address callee)
        external
        onlyOwner
    {
        // TODO add multisig voting mechanism
        delete authorizedCallers[callee];
        emit CallerDeauthorized(callee);
    }

    ////////////////////////// Airline
    function getAirlineBallotsByAirlineAddress(address airlineAddr)
    public
    view
    returns (address[] memory)
    {
        return ballots[ElectionTopics.AIRLINE_REGISTRATION][airlineAddr];
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     * add to register candidates can only be done either if #airlines <= 4 by existing airlines without voting or
     * else by voting of existing airlines
     *
     */
    function createAirline(address airlineAddr)
    external
    requireIsOperational
    requireIsCallerAuthorized
    requireIsAirlineNotExisting(airlineAddr) // no hard condition
    {
        // msg.sender is now address of the calling contract therefore use tx.origin for registeredBy
        // new airline
        numOfAirlines = numOfAirlines.add(1);
        Airline memory newAirline = Airline({id:numOfAirlines, isRegistered: false, investment: 0, registeredBy: tx.origin, timestamp: block.timestamp});
        airlines[airlineAddr] = newAirline;
        // fire event newAirline
        emit AirlineNewRegistration(airlineAddr, newAirline.id, newAirline.registeredBy, newAirline.timestamp);
    }

    /**
     * @dev Add an airline to the registration queue
     *      Can only be called from FlightSuretyApp contract
     * add to register candidates can only be done either if #airlines <= 4 by existing airlines without voting or
     * else by voting of existing airlines
     *
     */
    function registerAirline(address airlineAddr)
    external
    requireIsOperational
    requireIsCallerAuthorized
    requireIsAirlineNotRegistered(airlineAddr)
    {

        airlines[airlineAddr].isRegistered = true;
        numOfRegisteredAirlines = numOfRegisteredAirlines.add(1);

        emit AirlineRegistered (
            airlineAddr,
            airlines[airlineAddr].id,
            airlines[airlineAddr].isRegistered,
            airlines[airlineAddr].registeredBy,
            airlines[airlineAddr].investment,
            airlines[airlineAddr].timestamp
        );
    }

    /*
        submitAirline
        if not existing
            createAirline
        confirmAirline
        if(votingSuccess)
            registerAirline
    */

    ///
    // confirmedBy could be substituted with tx.origin
    function confirmAirline(address airlineAddr, address confirmedBy)
    external
    requireIsOperational
    requireIsCallerAuthorized
    requireIsAirlineExisting(airlineAddr)
    {
        ballots[ElectionTopics.AIRLINE_REGISTRATION][airlineAddr].push(confirmedBy);
    }



    // fundAirline

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     * Airlines go through a two step process:
     *   1. register (5th airline and higher via voting) 2. fund
     *   2. if voting applicable and voting accepted
     *   3. this function to fund and activate an airline for (voting, and insurances)
     *
     */
    function fundAirline(address airline) // TODO check 1. if it is better to use tx.origin 2. payable function or use receive or fallback one?
    public
    payable
    requireIsOperational
    requireIsCallerAuthorized
        //IsFeeSufficientChangeBack(AIRLINE_REGISTRATION_FEE)
    {
        // already funded
        if(airlines[airline].investment == 0) {
            require(msg.value == AIRLINE_REGISTRATION_FEE, "Airline funding must be exactly 10 ether");
            //airlines[airline].balance = msg.value;
            airlines[airline].investment = msg.value;
            numOfFundedAirlines = numOfFundedAirlines.add(1);
            //emit
            emit AirlineFunded(airline, airlines[airline].id, airlines[airline].isRegistered, airlines[airline].registeredBy, airlines[airline].investment, airlines[airline].timestamp);
        } else {
            // refund
            //require(airlines[airline].investment >= AIRLINE_REGISTRATION_FEE, "Airline must be funded for refunding");
            airlines[airline].investment = airlines[airline].investment.add(msg.value);
            //emit
            emit AirlineRefunded(airline, airlines[airline].id, airlines[airline].investment);
        }
    }
    /*
    //TODO why this can be called in receive function, although msg.sender should be this contract instead of app contract
    function refundAirline(address airline) // TODO check 1. if it is better to use tx.origin 2. payable function or use receive or fallback one?
        public
        payable
        requireIsOperational
        requireIsCallerAuthorized
        requireIsAirlineRegistered(airline)
        //IsFeeSufficientChangeBack(AIRLINE_REGISTRATION_FEE)
    {
        require(airlines[airline].investment >= AIRLINE_REGISTRATION_FEE, "Airline must be funded for refunding");

        //airlines[airline].balance = msg.value;
        airlines[airline].investment = airlines[airline].investment.add(msg.value);
        //emit
        emit AirlineRefunded(airline, airlines[airline].id, airlines[airline].investment);
    }
    */


    /**
     * @dev Register a future flight for insuring.
     * Optional part - UI defines the flights.
     * Only a fully registered airline can register a flight with a name + timestamp
     */
    //bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
    function createFlight(bytes32 flightKey)
        external
        requireIsOperational
        requireIsCallerAuthorized
        requireIsFlightNotExisting(flightKey)
        // check if existinglkjljk
    {
        numOfFlights = numOfFlights.add(1);
        flights[flightKey].id = numOfFlights;
        flights[flightKey].isRegistered = true;
        flights[flightKey].registeredBy = tx.origin; //TODO better as parameter
        flights[flightKey].status = 0; //STATUS_CODE_UNKNOWN from app contract // TODO better modularization
        flights[flightKey].passengers = new address[](0);

        //TODO add create insurances
        //flights[flightKey].passengers = new address[](0);
        delete flightInsurances[flightKey];// = new Insurance[](0);
        //below is not working due to: Copying of type struct FlightSuretyData.Insurance memory[] memory to storage not yet
        // flightInsurances[flightKey] = new Insurance[](0);
        //TODO add emit()
        emit FlightCreated(flightKey, msg.sender, tx.origin);
    }

    function updateFlightStatus
    (
        bytes32 flightKey,
        uint8 newStatus
    )
        external
        requireIsOperational
        requireIsCallerAuthorized
        // TODO check if existing
    {
        //bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        flights[flightKey].status = newStatus; //STATUS_CODE_UNKNOWN from app contract // TODO better modularization
        emit FlightUpdated(flightKey, newStatus);
    }

    /**
     * @dev Register a future flight for insuring.
     * Optional part - UI defines the flights.
     * Only a fully registered airline can register a flight with a name + timestamp
     */
    function registerPassengerForFlight
    (
        bytes32 flightKey,
        address passenger
    )
        external
        requireIsOperational
        requireIsCallerAuthorized
        requireIsFlightExisting(flightKey)
        requireIsPassengerNotOnFlight(flightKey, passenger)
    {
        passengers[flightKey][passenger] = true;
        flights[flightKey].passengers.push(passenger);
        emit PassengerRegistered(flightKey, msg.sender, passenger);
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function createInsuranceForFlight
    (
        bytes32 flightKey,
        address passenger,
        uint256 value
    )
        external
        payable
        requireIsOperational
        requireIsCallerAuthorized
        requireIsFlightExisting(flightKey) //TODO move everything to app contract
        requireIsPassengerOnFlight(flightKey, passenger)
    {
        //flightSuretyData.escrow.deposit(tx.origin) won´t work in our case we not one account
        /*
        if(flightInsurances[flightKey].length == 0) {

        }
        */
        //TODO check: payable and then use msg.value?!
        flightInsurances[flightKey].push(Insurance({passenger: passenger, insurance: value}));
        emit InsurancePurchased(passenger, value);
        emit BalanceChanged(address(msg.sender).balance, address(this).balance);
        //     event PurchasedOrigin(address indexed payee, uint256 weiAmount, uint256 balance);
        //emit PurchasedOrigin(msg.sender, msg.value, address(this).balance);

        //set mapping
        // if passengers registered => then one could iterate over array and check if investment
        // flight key => mapping address => investment
        // alternative
        // flight key => [struct(address, investment)]
        // credit iterate over array for a flight key after landing and calc

    }

    /**
     * @dev Credits payouts to insurees
     * Meaning due to delays particular passengers with insurance for delayed flight are credited 1.5 times of their investment.
     * based on insurances mapping transfer balance to payouts
     *
    */
    function creditInsurees
    (
        bytes32 flightKey
    )
        external
        requireIsOperational
        requireIsCallerAuthorized
    {
        // calculate the credit (1.5 insurance fee)
        // iterate over all passengers for this flight with
        //bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        // iterate over flight insurance array and calculate

        /*
        // error memory / storage issue
        Insurance[] memory insuranceArray =  flightInsurances[flightKey];
        for(uint c=0; c<insuranceArray.length; c++) {
            uint256 newBalance = insuranceArray[c].insurance * RISK_RETURN;
            address passenger = insuranceArray[c] .passenger;
            payouts[passenger] += newBalance;
        }
        */

        for(uint i=0; i<flightInsurances[flightKey].length; i++) {
            uint256 newBalance = Util.getRoI(flightInsurances[flightKey][i].insurance, ROI_NOMINATOR, ROI_DENOMINATOR);
            address passenger = flightInsurances[flightKey][i].passenger;
            payouts[passenger] = payouts[passenger].add(newBalance);
        }
        delete flightInsurances[flightKey];
        //flightInsurances[flightKey].length = 0;// = new Insurance[](0);
        // emit event to tell how many passenger investment + payout
        //emit InsuranceDeposited(msg.sender, payout);
    }

    function withdrawInsuree
    (
        address insuree
    )
        external
        requireIsOperational
        requireIsCallerAuthorized
    {
        uint256 currentBalance = address(this).balance;
        uint256 payout = payouts[insuree];
        require(currentBalance >= payout, "Funds needed, cannot do payout");

        payouts[insuree] = 0;
        payable(insuree).transfer(payout);
        emit InsuranceWithdrawn(msg.sender, payout, currentBalance, address(this).balance);
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    // This function is called for all messages sent to
    // this contract, except plain Ether transfers
    // (there is no other function except the receive function).
    // Any call with non-empty calldata to this contract will execute
    // the fallback function (even if Ether is sent along with the call).
    /*
    fallback()
        external
        payable
        requireIsOperational
    {
        //fundAirline();

    }
    */

    // Function to receive Ether. msg.data must be empty
    receive()
        external
        payable
        requireIsCallerAuthorized
    {
        // TODO how to use this - check why this is working
        // refundAirline(tx.origin);
        emit ContractFunded(tx.origin, msg.value);
    }


    /********************************** additional stubs *************************/



}

