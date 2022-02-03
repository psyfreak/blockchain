// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

contract Airlines  {

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    uint256 public constant AIRLINE_REGISTRATION_FEE = 10 wei; //10 ether;

    // airlines
    struct Airline {
        uint256 id; // incrementing no.
        // TODO add string name;
        bool isRegistered; // registration went through
        address registeredBy;
        uint256 investment; // has invested
        uint256 timestamp;
        // role //TODO one can do this with Access roles such as in prev. lesson
        //address wallet; // money might be store here
    }

    mapping(address => Airline) airlines;

    uint256 public numOfAirlines = 0; // all airlines
    uint256 public numOfRegisteredAirlines = 0; // registered <= airlines
    uint256 public numOfFundedAirlines = 0; // funded <= registered

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event AirlineNewRegistration(address airline, uint256 id, address registeredBy, uint256 timestamp);
    event AirlineRegistered(address airline, uint256 id, bool isRegistered, address registeredBy, uint256 investment, uint256 timestamp);
    event AirlineFunded(address airline, uint256 id, bool isRegistered, address registeredBy, uint256 investment, uint256 timestamp);
    event AirlineRefunded(address airline, uint256 id, uint256 investment);

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/
    function getAirlineByAddress (address airline)
        public
        view
        returns(
            uint256,
            bool,
            address,
            uint256,
            uint256
        )
    {
        return (airlines[airline].id, airlines[airline].isRegistered, airlines[airline].registeredBy, airlines[airline].investment, airlines[airline].timestamp);
    }

    function isAirlineExisting (address airline)
        public
        view
        returns(bool)
    {
        return (airlines[airline].registeredBy != address(0));
    }

    function isAirlineRegistered (address airline)
        public
        view
        returns(bool)
    {
        return (airlines[airline].isRegistered);
    }

    function isAirlineFunded (address airline)
        public
        view
        returns(bool)
    {
        return (isAirlineRegistered(airline) && airlines[airline].investment >= AIRLINE_REGISTRATION_FEE);
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/
    modifier requireIsAirlineExisting(address airlineAddr) {
        require(isAirlineExisting(airlineAddr), "Airline does not exist");
        _;
    }
    modifier requireIsAirlineNotExisting(address airlineAddr) {
        require(!isAirlineExisting(airlineAddr), "Airline does already exist");
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireIsAirlineNotRegistered(address airline)
    {
        require(!isAirlineRegistered(airline), "Airline is already registered");
        _;
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireIsAirlineFunded(address airline)
    {
        require(isAirlineFunded(airline), "Airline is not funded yet");
        _;
    }
}