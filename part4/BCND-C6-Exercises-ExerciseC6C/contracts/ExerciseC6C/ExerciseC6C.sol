pragma solidity ^0.4.25;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "../../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract ExerciseC6C {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    struct Profile {
        string id;
        bool isRegistered;
        bool isAdmin;
        uint256 sales;
        uint256 bonus;
        address wallet;
    }

    address private contractOwner;              // Account used to deploy contract
    mapping(string => Profile) employees;      // Mapping for storing employees

    mapping(address => uint256) private authorizedContracts;     // Mapping for storing allowed originating contracts

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/

    // No events

    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor
                                (
                                ) 
                                public 
    {
        contractOwner = msg.sender;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }


    modifier requireIsCallerAuthorized()
    {
        require(authorizedContracts[msg.sender] == 1, "Caller is not contract owner");
        _;
    }


    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function authorizeContract
                                (
                                    address contractAddress
                                )
                                external
                                requireContractOwner
    {
        authorizedContracts[contractAddress] = 1;
    }

    function deauthorizeContract
                                (
                                    address contractAddress
                                )
                                external
                                requireContractOwner
    {
        delete authorizedContracts[contractAddress];
    }

   /**
    * @dev Check if an employee is registered
    *
    * @return A bool that indicates if the employee is registered
    */   
    function isEmployeeRegistered
                            (
                                string id
                            )
                            external
                            view
                            returns(bool)
    {
        return employees[id].isRegistered;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    function registerEmployee
                                (
                                    string id,
                                    bool isAdmin,
                                    address wallet
                                )
                                external
                                requireContractOwner
    {
        require(!employees[id].isRegistered, "Employee is already registered.");

        employees[id] = Profile({
                                        id: id,
                                        isRegistered: true,
                                        isAdmin: isAdmin,
                                        sales: 0,
                                        bonus: 0,
                                        wallet: wallet
                                });
    }

    function getEmployeeBonus
                            (
                                string id
                            )
                            external
                            view
                            requireContractOwner
                            returns(uint256)
    {
        return employees[id].bonus;
    }

    function updateEmployee
                                (
                                    string id,
                                    uint256 sales,
                                    uint256 bonus

                                )
                                external // before internal but it is accessed in ExerciseC6CApp.sol
                                //requireContractOwner in step 3 (TODO but not clear why....)
                                // before it was the one who deployed the app contract, but the msg.sender of app and data contract might defer.this
                                // i.e. the AppContract calls this function, then msg.sender is the contract address or the address that deployed the contract (check for contract msg.sender != tx.origin)
                                // tx.origin = will be the account that initiated the chain of contract calls.
    {
        require(employees[id].isRegistered, "Employee is not registered.");

        employees[id].sales = employees[id].sales.add(sales);
        employees[id].bonus = employees[id].bonus.add(bonus);

    }






}