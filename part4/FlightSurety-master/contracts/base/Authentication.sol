// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8;

import "../../node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";

contract Authentication is Ownable  {
    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    //Escrow escrow;
    mapping(address => bool) internal authorizedCallers;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/
    event CallerAuthorized(address caller); // triggered whenever new caller gets authorized
    event CallerDeauthorized(address caller);  // triggered whenever an existing caller gets unauthorized (not used yet)


    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/
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
    modifier requireIsCallerAuthorized()
    {
        require(isCallerAuthorized(msg.sender), "Caller is not authorized");
        _;
    }



}