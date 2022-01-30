// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import {Util} from "./base/Util.sol";
import "./FlightSuretyData.sol";

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSuretyApp is Ownable {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    // Fee to be paid when registering oracle
    uint256 public constant ORACLE_REGISTRATION_FEE = 10 wei; //1 ether;

    // Flight status codees
    uint8 private constant STATUS_CODE_UNKNOWN = 0;
    uint8 private constant STATUS_CODE_ON_TIME = 10;
    uint8 private constant STATUS_CODE_LATE_AIRLINE = 20; // => payment process gets triggered
    uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
    uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
    uint8 private constant STATUS_CODE_LATE_OTHER = 50;

    event OnChangeBalances(uint256 balanceApp, uint256 balanceData);


    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    FlightSuretyData flightSuretyData;
    //address flightSuretyData;

    struct Flight {
        bool isRegistered;
        uint8 statusCode;
        uint256 updatedTimestamp;        
        address airline;
        // might add all insurance bids here via array address + funding
    }
    mapping(bytes32 => Flight) private flights;


    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    *
    */
    constructor
                                (
                                    FlightSuretyData dataContract
                                )
    {
        // call the data contract and set this address
        flightSuretyData = FlightSuretyData(dataContract);
        //flightSuretyData.authorizeCaller(address(this)); call is contract, therefore this is not working
        // add app contract as authorized caller for data contract

        // add first airline
        //flightSuretyData.authorizeContract(address(this)); //not working with this address, because this contract did not deploy the datacontract.
        // registerFirstAirline when contract is deployed (TODO which contract, app or data contract, might be better?)
    }


    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

  
   /**
    * @dev Add an airline to the registration queue
    * msg.sender is the airline to be registered
    * any msg.sender can register / authentication if address is airline is not done here.
    * if <=4 airlines one vote of any invested airline is sufficient
    * if >4 airlines at least > #airlines/2 roundedUp must be voted for / so one could vote true or false or not at all


    * It is only defined that below 5 airlines, existing airlines must register new ones but there is no restriction
    * how airlines may register greater or equal 5 airlines.
    * I defined it this way, that 5<= airlines can register themselve publically, so an airline can directly call this function.this.this
    * Easist solution would be to just change the voting for the first registration, there is no vote needed, for <=4 only one vote needed
    * and for >=5 we need a majority vote from existing airlines.
    * One could implement it in this way that only available airlines can suggest other airlines either with or without voting.
    * Airline can be registered, but does not participate in contract
    * This is unclear => I assume, that only reigstered airlines with funding can only vote and/or

    * easiest version if other existing airlines just call registerAirline it counts as a voting for such airline
    */   
    function registerAirline
                            (
                                address newAirline
                            )
                            external
                            requireIsAirlineAuthorized(msg.sender)
                            //TODO can only be called by authoirzedCallers
                            //one should trigger an event ... returns(bool success, uint256 votes)
    {
        // if not existing create Airlin
        // check if airline is available if not submit

        if(!flightSuretyData.isAirlineExisting(newAirline)) {
            flightSuretyData.createAirline(newAirline);
        }

        //see require airline must be authorized therefore registered + invested if(flightSuretyData.isAirlineFunded(msg.sender)) { }
        flightSuretyData.confirmAirline(newAirline, msg.sender);
        if(isConfirmed(newAirline)) {
            // if election fine then register Airline
            flightSuretyData.registerAirline(newAirline);
        }
        //return (success, 1); // draft contains this, but statechanging methods cannot have return values
    }


     // TODO is this needed ? one could also
    function fundAirline ( ) external payable {

        //a.blah{value: ValueToSend}(2, 3)
        flightSuretyData.fundAirline{value: msg.value}(msg.sender);// we could also call and send it to directly via msg.value
        //payable(address(flightSuretyData)).transfer(msg.value);
    }



   /**
    * @dev Register a future flight for insuring.
    * Optional part - UI defines the flights.
    * Only a fully registered airline can register a flight with a name + timestamp
    * A flight can be only registered by a registered and funded airline.
    */  
    function registerFlight
                                (
                                    string calldata flight,
                                    uint256 timestamp
                                )
                                external
                                requireIsAirlineAuthorized(msg.sender)
    {
        bytes32 flightKey = Util.getFlightKey(msg.sender, flight, timestamp);
        flightSuretyData.createFlight(flightKey);
    }

    /**
       * @dev Buy flight ticket for a flight
       * modifer check if flight is available, insuree is a passanger
       */

    function bookFlight
    (
        address airline,
        string calldata flight,
        uint256 timestamp
    )
    external
    payable
    requireIsOperational
    //must be greater than 0 and less < 150
    {
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        // check if flight is existing
        flightSuretyData.registerPassengerForFlight(flightKey, msg.sender);
    }

    function buyFlightInsurance
    (
        address airline,
        string calldata flight,
        uint256 timestamp
    )
    external
    payable
    requireIsOperational
    Cap(flightSuretyData.MAX_INSURANCE_FEE())
    //TODO passenger should
    //must be greater than 0 and less < 150
    {
        //flightSuretyData.escrow.deposit(tx.origin) won´t work in our case we not one account
        bytes32 flightKey = Util.getFlightKey(airline, flight, timestamp);
        flightSuretyData.createInsuranceForFlight{value: msg.value}(flightKey, msg.sender, msg.value);// we could also call and send it to directly via msg.value

        //flightSuretyData.createInsuranceForFlight(flightKey, msg.sender, msg.value); //payable function vs. transfer afterwards
        // msg.value lands here => also balance is updated for this contract
        // we might transfer the data to
        //payable(address(flightSuretyData)).transfer(msg.value);
    }

    // deposit function needed from to actually all payables send ether to AppContract

    
   /**
    * @dev Called after oracle has updated flight status
    * triggered, when oracle gets back.
    * if not status != 20 - there is money, which can be allocated and not for example.
    * If the the status != 20 meaning that the investment by insurance purchases goes into the pool again.
    * and you can dissolve the insurance mapping for a specific flight.
    *
    */  
    function processFlightStatus
                                (
                                    address airline,
                                    string calldata flight,
                                    uint256 timestamp,
                                    uint8 statusCode
                                )
                                //internal
                               public
    {

        bytes32 flightKey = Util.getFlightKey (airline, flight, timestamp);
        //oracleResponses[flightKey].isOpen = false; // wrong!!!
        // CODE EXERCISE 3: Announce to the world that verified flight status information is available

        // Save the flight information for posterity

        //flights[flightKey] = FlightStatus(true, statusId);

        // add payout etc. in the case statusCode is delay
        if(statusCode == STATUS_CODE_LATE_AIRLINE) {
            flightSuretyData.creditInsurees(flightKey);
        }
        else {
            //TODO one must delete existing insurances
        }


    }


    // Generate a request for oracles to fetch flight information
    // Triggered by button click in UI
    function fetchFlightStatus
                        (
                            address airline,
                            string calldata flight,
                            uint256 timestamp
                        )
                        external
                        //TODO by anyone?
    {
        uint8 index = Util.getRandomIndex10(msg.sender, 0);

        // Generate a unique key for storing the request
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));

        /*
        // before solidity 0.7
        oracleResponses[key] = ResponseInfo({
                                                requester: msg.sender,
                                                isOpen: true
                                            });
        */
        // new
        oracleResponses[key].requester = msg.sender;
        oracleResponses[key].isOpen = true;

        emit OracleRequest(index, airline, flight, timestamp);
    }

    /**
     *  @dev Transfers eligible payout funds to insuree
     * This is the particular withdraw function, which is called by an insuree to get a full payout of their credit.
     * Potentially move to app contract => withdraw function
     *
    */
    function withdraw
    (
    )
    external
    requireIsOperational
    //TODO add check if money is sufficient to payout
    {
        flightSuretyData.withdrawInsuree(msg.sender);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        // we could also directly call refund such as in fund, but would like to test receive function
        //payable(address(flightSuretyData)).transfer(msg.value);
        /*
        // no gas available - only 2300 gas
        address payable jo = payable(address(flightSuretyData));
        jo.transfer(msg.value);
        */
        // this work juhuuu
        (bool sent, bytes memory data) = address(flightSuretyData).call{value: msg.value}("");
        require(sent, "Failed to send Ether");

    }

    /********************************************************************************************/
    /*                                       ORACLE FUNCTIONS                                  */
    /********************************************************************************************/
// region ORACLE MANAGEMENT
    // TODO move to seperate contract

    // Incremented to add pseudo-randomness at various points
    uint8 private nonce = 0;


    // Number of oracles that must respond for valid status
    uint256 private constant MIN_RESPONSES = 3;


    struct Oracle {
        bool isRegistered;
        uint8[3] indexes;        
    }

    // Track all registered oracles
    uint8 public oracleCount = 0;
    mapping(address => Oracle) private oracles;

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
    mapping(bytes32 => ResponseInfo) private oracleResponses;

    // Event fired each time an oracle submits a response
    event FlightStatusInfo(address airline, string flight, uint256 timestamp, uint8 status);


    event OracleRegistered(address oracle, uint8[3] indexes, uint8 count);

    event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);

    // Event fired when flight status request is submitted
    // Oracles track this and if they have a matching index
    // they fetch data and submit a response
    event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);


    // Register an oracle with the contract
    /// Every oracles response to 3 random generated indices
    function registerOracle
                            (
                            )
                            external
                            payable
                            IsFeeSufficientChangeBack(ORACLE_REGISTRATION_FEE)
    {
        // check if already registered
        require(!oracles[msg.sender].isRegistered, "Oracle is already registered");

        // pseudo random indices
        uint8[3] memory indexes = Util.generateIndexes(msg.sender);

        oracles[msg.sender] = Oracle({
                                        isRegistered: true,
                                        indexes: indexes
                                    });
        oracleCount++;
        emit OracleRegistered(msg.sender, indexes, oracleCount);
    }

    function getMyIndexes
                            (
                            )
                            view
                            external
                            returns(uint8[3] memory)
    {
        require(oracles[msg.sender].isRegistered, "Not registered as an oracle");

        return oracles[msg.sender].indexes;
    }




    // Called by oracle when a response is available to an outstanding request
    // For the response to be accepted, there must be a pending request that is open
    // and matches one of the three Indexes randomly assigned to the oracle at the
    // time of registration (i.e. uninvited oracles are not welcome)
    // function is call on the server given the index and the other details
    // now every oracle check if index matches and if so add an entry + generated status to data structure
    // oracleResponses[key].responses. If threshold hit it processes the flight status.
    function submitOracleResponse
                        (
                            uint8 index,
                            address airline,
                            string calldata flight,
                            uint256 timestamp,
                            uint8 statusCode
                        )
                        external
    {
        // check if the assigned index is matched to one requested
        require(
            (oracles[msg.sender].indexes[0] == index) ||
            (oracles[msg.sender].indexes[1] == index) ||
            (oracles[msg.sender].indexes[2] == index),
                "Index does not match oracle request"
        );
        // if index matches, generate key and check if request still open
        bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp)); 
        require(oracleResponses[key].isOpen, "Flight or timestamp do not match oracle request");

        // push calculated value to responses array (different results have different array with all approvers
        oracleResponses[key].responses[statusCode].push(msg.sender);

        // Information isn't considered verified until at least MIN_RESPONSES
        // oracles respond with the *** same *** information
        emit OracleReport(airline, flight, timestamp, statusCode);
        if (oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES) {
            oracleResponses[key].isOpen = false;
            emit FlightStatusInfo(airline, flight, timestamp, statusCode);
            // Handle flight status as appropriate
            // TODO not right - index is missing
            processFlightStatus(airline, flight, timestamp, statusCode);
        }
    }



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
        // TODO Modify to call data contract's status
        require(flightSuretyData.isOperational(), "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    modifier IsFeeSufficientChangeBack (uint _amount) {
        require(msg.value >= _amount, "Amount is not sufficient");
        _;
        if (msg.value > _amount) {
            payable(msg.sender).transfer(msg.value - _amount);
        }
    }

    modifier requireIsAirlineAuthorized(address airline)
    {
        require(flightSuretyData.isAirlineFunded(airline), "Airline is not authorized");
        _;
    }

    // Define a modifier that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address, "caller is not verified");
        _;
    }

    modifier Cap (uint _amount) {
        require(msg.value <= _amount, "Amount is capped");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function isOperational()
    public
    view
    returns(bool)
    {
        return flightSuretyData.isOperational();  // Modify to call data contract's status
    }

    function isConfirmed(address newAirline)
    private
    view
    returns (bool)
    {
        bool confirmed = false;
        // less or equal than 4 airlines
        address[] memory confirmationsForAirline = flightSuretyData.getAirlineBallotsByAirlineAddress(newAirline);
        uint numOfConfirmations = confirmationsForAirline.length;
        uint256 numOfFundedAirlines = flightSuretyData.numOfFundedAirlines();

        // below or equal threshold => confirmation ok if the msg.sender is an already confirmed airline
        if(flightSuretyData.VOTING_THRESHOLD() >= numOfFundedAirlines) {
            // only one vote by funded airline
            if(numOfConfirmations > 0) {
                confirmed = true;
            }
        }
        else { // if more than 4 airlines
            // 50%
            if(numOfConfirmations >= numOfFundedAirlines.div(2) ) {
                // check duplicate
                confirmed = true;
            }
        }
        return confirmed;
    }

}


