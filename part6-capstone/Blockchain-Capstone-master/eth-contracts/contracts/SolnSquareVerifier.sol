// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "./ERC721Mintable.sol";
import "./Verifier.sol";

contract SolnSquareVerifier is ERC721Mintable {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    Verifier verifier;

    uint256 counter = 0;

    // TODO define a solutions struct that can hold an index & an address
    // The solution refers to the set of variables that you pass to verifyTx
//The address from the struct is the address of the the person that submitted that solution
//The index is an identifier that represents the order of the solution. If it is the first solution submitted to the system, then its index is 1. If it is the eighth solution submitted to the system, then its index is 8.
    struct Solution {
        uint256 id; // incrementing no.
        bool isRegistered;
        address registeredBy;
    }
    // TODO define an array of the above struct or
    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) solutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 indexed id, address indexed sender, bytes32 indexed solution);

    // TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
    constructor(Verifier verifierContract)
    {
        //ERC721Mintable

        // call the Verifier contract and set this address
        verifier = Verifier(verifierContract);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution ()
        public
    {
        bytes32 solutionHash = "";
        // only add solution if not already existing
        if(!isSolutionRegistered(solutionHash)) {
            counter.add(counter, 1);
            solutions[solutionHash].id = counter;
            solutions[solutionHash].solutionIndex = solutionHash;
            solutions[solutionHash].isRegistered = true;
            solutions[solutionHash].registeredBy = msg.sender;
            emit SolutionAdded(solutions[solutionHash].id, solutions[solutionHash].registeredBy, solutionHash);
        }
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    function mint (bytes32 solution)
        public
    {
        //  - make sure the solution is unique (has not been used before)
        //  - make sure you handle metadata as well as tokenSuply
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/
    function isSolutionRegistered (bytes32 solution)
        public
        view
        returns(bool)
    {
        return (solutions[solution].isRegistered);
    }

    function getSolutionByKey (bytes32 solKey)
        public
        view
        requireIsSolutionExisting(solKey)
        returns(
            uint256 ,
            bytes32,
            bool,
            address
        )
    {
        return (solutions[solKey].id, solutions[solKey].solutionIndex, solutions[solKey].isRegistered, solutions[solKey].registeredBy);
    }


    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/
    modifier requireIsSolutionExisting(bytes32 solKey)
    {
        require(isSolutionRegistered(solKey), "Flight does not exist.");
        _;
    }

}

























