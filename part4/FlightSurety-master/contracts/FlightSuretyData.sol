// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import "../node_modules/openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

/*
 add open zeppelin ownable
 add open zeppelin access
*/

contract FlightSuretyData {
    using SafeMath for uint256;

    uint256 public constant AIRLINE_INVESTMENT = 10 ether;
    uint256 public constant MAX_INSURANCE_FEE = 1 ether;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address private contractOwner;                                      // Account used to deploy contract
    address private appContract;                                        // address of app contract
    mapping(address => uint256) private authorizedContracts;
    bool private operational = true;                                    // Blocks all state changes throughout the contract if false

    // mapping for passengers flight towards insurance balance / a passenger might have multiple insurances for different flights flight 1: 1 ether, flight 2: 0.6 ether etc.
    mapping(address => mapping (string => uint256)) private insurances;// mapping of passenger towards Insurance Info (insurance balanace per flight)

    // Track all oracle responses
    // Key = hash(index, flight, timestamp)
    //mapping(bytes32 => ResponseInfo) private insurancesPaidPerPassenger;


    mapping(address => uint256) public payouts; // after oracle submission payout is aggregated 1.5 times insurance flight value;

    // airlines
    struct Airline {
        string name;
        bool isRegistered; // registration went through
        uint256 investment; // has invested
        // role //TODO one can do this with Access roles such as in prev. lesson
        //address wallet; // money might be store here
    }
    mapping(address => Passenger) airlines;


    // airlines
    struct Passenger {
        string name;
        uint256 sales;
        uint256 bonus;
        address wallet;
    }
    mapping(address => Passenger) passengers;

    // mapping for airline funding (maps airline address to amount of funding
    struct FundingInfo {
        bool isRegistered; // airline is registered
        bool isInvested; // airline has invested (currently fixed to AIRLINE_INVESTMENT) and participates
        uint256 balance; // it is defined to have AIRLINE_INVESTMENT per investment, but maybe in future there are different investments and voting rights
    }
    mapping(address => FundingInfo) private fundings;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                )
    {
        contractOwner = msg.sender;
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
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    modifier GiveChangeBack(uint _amount) {
        _;
        if (msg.value > _amount) {
            payable(msg.sender).transfer(msg.value - _amount);
        }
    }
    modifier Fee (uint _amount) {
        if (msg.value >= _amount) {
            _;
        }
    }

    modifier onlyEOA() {
        require(msg.sender == tx.origin, "Must use EOA");
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireIsAirlineRegistered(address airline)
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }
    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireIsAirlineInvested(address airline)
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    modifier onlyAppContract {
        require(msg.sender == appContract);
        _;
    }

    modifier requireIsCallerAuthorized()
    {
        require(authorizedContracts[msg.sender] == 1, "Caller is not authorized");
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
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        // TODO add multisig voting mechanism
        operational = mode;
    }

    /**
        * @dev Sets the reference to the app contract, so that we can only allow
        *  a specified contract to access and modify data in this contract
        *
        * When operational mode is disabled, all write transactions except for this one will fail
    */

    function authorizeContract ( address contractAddress )
                            external
                            requireContractOwner
    {
        // TODO add multisig voting mechanism
        authorizedContracts[contractAddress] = 1;
    }

    /**
        * @dev deletes the reference to a specified contract, so that we can only allow
        *  a specified contract to access and modify data in this contract
        *
        * When operational mode is disabled, all write transactions except for this one will fail
    */
    function deauthorizeContract
                        (
                            address contractAddress
                        )
                        external
                        requireContractOwner
    {
        // TODO add multisig voting mechanism
        delete authorizedContracts[contractAddress];
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
    function registerAirline
                            (   
                            )
                            external
                            requireIsOperational
                            requireIsCallerAuthorized
    {
        // airline
    }

    /**
     * @dev Initial funding for the insurance. Unless there are too many delayed flights
     *      resulting in insurance payouts, the contract should be self-sustaining
     * Airlines go through a two step process:
     *   1. register (5th airline and higher via voting) 2. fund
     *   2. if voting applicable and voting accepted
     *   3. this function to fund and activate an airline for (voting, and insurances)
     *
     */
    function fundAirline
    (
    )
    public
    payable
    requireIsOperational
    {
        require(fundings[msg.sender].isRegistered, "Airline is not registered yet");
        require(!fundings[msg.sender].isInvested, "Airline has been already funded");
        require(msg.value == AIRLINE_INVESTMENT, "Airline funding must be exactly 10 ether");

        fundings[msg.sender].balance = msg.value;
        fundings[msg.sender].isInvested = true;
    }


   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            (                             
                            )
                            external
                            payable
                            requireIsOperational
    {
        /*
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        _transfer(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            address payable newOwnerAddressPayable = payable(msg.sender);
            newOwnerAddressPayable.transfer(msg.value - starCost);
        }
        starsForSale[_tokenId] = 0; // star is not for sale anymore
        */
    }

    /**
     * @dev Credits payouts to insurees
     * Meaning due to delays particular passengers with insurance for delayed flight are credited 1.5 times of their investment.
     * based on insurances mapping transfer balance to payouts
     *
    */
    function creditInsurees
                                (
                                )
                                external
                                requireIsOperational
    {
    }

    /**
     *  @dev Transfers eligible payout funds to insuree
     * This is the particular withdraw function, which is called by an insuree to get a full payout of their credit.
     * Potentially move to app contract => withdraw function
     *
    */
    function pay
                            (
                            )
                            external
                            requireIsOperational
    {
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
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
    fallback() external payable requireIsOperational { fundAirline(); }


    /********************************** additional stubs *************************/



}

