// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.1;

import 'openzeppelin-solidity/contracts/utils/Counters.sol';
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "./ERC721Mintable.sol";
import "./Verifier.sol";

contract SolnSquareVerifier is ERC721Mintable {
    using Counters for Counters.Counter;
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)
    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    // TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
    Verifier verifier;

    Counters.Counter counter;

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
    ERC721Mintable("HouseToken", "HT")
    {
        //ERC721Mintable

        // call the Verifier contract and set this address
        verifier = Verifier(verifierContract);
    }

   // TODO Create a function to add the solutions to the array and emit the event
    // The solution refers to the set of variables that you pass to verifyTx  .verifyTx(proof.proof, proof.inputs)
    function addSolution (bytes32 solutionHash)
        public
        returns(uint256)
    {
        require(!isSolutionRegistered(solutionHash), "Solution was already committed");
        // only add solution if not already existing
        //if(!isSolutionRegistered(solutionHash)) {
        solutions[solutionHash].id = counter.current();
        solutions[solutionHash].isRegistered = true;
        solutions[solutionHash].registeredBy = msg.sender;
        counter.increment();
        emit SolutionAdded(solutions[solutionHash].id, solutions[solutionHash].registeredBy, solutionHash);
        return solutions[solutionHash].id;
        //}
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    // proof and input are taken from the verifier code
    // TODO find out why - if I change this function name to mint only, then tests result in error =>
    //   web3 calls the parent contract with different arg count
    function mintToken (Verifier.Proof memory proof, uint[2] memory input,  address to) //, uint256 tokenId
        public
    {
        //Verify that the proof was not used previously
        // generate bytes32 => solution
        bytes32 solutionHash = genHashForZokratesArguments(proof, input);
        //  - make sure the solution is unique (has not been used before)
        require(!isSolutionRegistered(solutionHash), "Solution was already committed");

        // Verify that the proof is valid
        // TODO proof input
        require(verifier.verifyTx(proof, input), "Verification invalid");
        // TODO addSolution();
        uint256 tokenId = addSolution(solutionHash);
        //  - make sure you handle metadata as well as tokenSuply
        //super.mint(to, tokenId);
        super.mint(to, tokenId); //tokendId is directly taken from the incrementing id of the solution => ensured only one solution can have one token
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function genHashForZokratesArguments(Verifier.Proof memory proof, uint[2] memory input)
        public
        pure
        returns(bytes32)
    {
        /*
        // we cannot pack structs, therefore we need to decompose them
        struct Proof {
            Pairing.G1Point a;
            Pairing.G2Point b;
            Pairing.G1Point c;
        }
            struct G1Point {
                uint X;
                uint Y;
            }
            // Encoding of field elements is: X[0] * z + X[1]
            struct G2Point {
                uint[2] X;
                uint[2] Y;
            }
        */

        // decompose proof struct with input and generate a hash
        bytes32 solutionHash =  keccak256(abi.encodePacked(proof.a.X, proof.a.Y, proof.b.X, proof.b.Y, proof.c.X, proof.c.Y, input));
        return solutionHash;
    }

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
            uint256,
            bytes32,
            bool,
            address
        )
    {
        return (solutions[solKey].id, solKey, solutions[solKey].isRegistered, solutions[solKey].registeredBy);
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

























