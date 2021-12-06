// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ExerciseC6A {

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/
    bool public isOperational; // = true instead of public you can set it private and add getter

    uint private nMultiPartyConsensus = 5; // max amount of admins

    uint private constant mMultiPartyConsensus = 2;// min. amount of
    address[] multiCalls = new address[](0);

    struct UserProfile {
        bool isRegistered;
        bool isAdmin;
    }

    address private contractOwner;                  // Account used to deploy contract
    mapping(address => UserProfile) userProfiles;   // Mapping for storing user profiles

    // we could define m available admin in a mapping, which is defined at deployment time or use register version

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
    {
        contractOwner = msg.sender;
        isOperational = true;
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


    modifier requireAdmin()
    {
        require(userProfiles[msg.sender].isAdmin, "Caller is not an admin");
        _;
    }

    modifier requireIsOperational()
    {
        require(isOperational, "Contract is paused");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

   /**
    * @dev Check if a user is registered
    *
    * @return A bool that indicates if the user is registered
    */   
    function isUserRegistered
                            (
                                address account
                            )
                            external
                            view
                            returns(bool)
    {
        require(account != address(0), "'account' must be a valid address.");
        return userProfiles[account].isRegistered;
    }

    /**
     * @dev vote
     *
    */
     function hasAlreadyVoted
    (
        address account
    )
     private
     returns(bool)
    {
        require(account != address(0), "'account' must be a valid address.");

        // check if sender has already voted if not add to votingMapping
        bool isDuplicate = false;
        for(uint c=0; c<multiCalls.length; c++) {
            if (multiCalls[c] == account) {
                isDuplicate = true;
                break;
            }
        }
        require(!isDuplicate, "Caller has already called this function.");
        multiCalls.push(account);
        return true;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    function setOperationalByOwner
    (
        bool mode
    )
    external
    requireContractOwner
    {
        isOperational = mode;
    }

    function setOperational
    (
        bool mode
    )
    external
    //requireContractOwner //prev. version without multi-party consensus
    requireAdmin
    {
        require(mode != isOperational, "New mode must be different from existing mode");

        hasAlreadyVoted(msg.sender);

        // check if voting completed
        if (multiCalls.length >= mMultiPartyConsensus) {
            isOperational = mode;
            multiCalls = new address[](0);
        }
    }

    function registerUser
                                (
                                    address account,
                                    bool isAdmin
                                )
                                external
                                requireContractOwner
                                requireIsOperational
    {
        require(!userProfiles[account].isRegistered, "User is already registered.");

        userProfiles[account] = UserProfile({
                                                isRegistered: true,
                                                isAdmin: isAdmin
                                            });
    }
}

