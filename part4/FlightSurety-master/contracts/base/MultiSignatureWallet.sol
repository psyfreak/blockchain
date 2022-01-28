// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
https://medium.com/hellogold/ethereum-multi-signature-wallets-77ab926ab63b
https://medium.com/hellogold/ethereum-multi-sig-wallets-part-ii-19077f6280a
https://github.com/ConsenSys-Academy/multisig-wallet-exercise/

    const owners = [accounts[0], accounts[1]]

    deployer.deploy(SimpleStorage)
    deployer.deploy(MultiSig, owners, 2)

MultisignatureVoting is used for FlightSurety for the following functions:
- setOperational
- registerAirline
so that airlines can anonymously vote for execution.
In particular if we have less than 4 airlines we need one vote, which is implicitly given by the airline who registers a new one
Above 4 airlines the voting must be over 50% of the amount of airlines


**/


/// Provides basic authorization control
contract MultiSignatureWallet {

    address[] public owners;
    uint public required;
    mapping (address => bool) public isOwner;

    uint public transactionCount;
    mapping (uint => Transaction) public transactions;

    mapping (uint => mapping (address => bool)) public confirmations;

    uint256 public constant VOTING_THRESHOLD = 4;

    struct Transaction {
        bool executed;
        address destination;
        uint value;
        bytes data;
    }

    event Deposit(address indexed sender, uint value);
    event Submission(uint indexed transactionId);
    event Confirmation(address indexed sender, uint indexed transactionId);
    event Execution(uint indexed transactionId, bytes data);
    event ExecutionFailure(uint indexed transactionId, bytes data);

    /// @dev Fallback function allows to deposit ether.
    fallback()
    external
    payable
    {
        if (msg.value > 0) {
            emit Deposit(msg.sender, msg.value);
        }
    }


    /*
     * Public functions
     */
    /// @dev Contract constructor sets initial owners and required number of confirmations.
    /// flightsurety add with firstAirline as owner + required = 4
    /// @param _owners List of initial owners.
    /// @param _required Number of required confirmations.
    constructor(address[] memory _owners, uint _required)
    validRequirement(_owners.length, _required)
    {
        for (uint i=0; i<_owners.length; i++) {
            isOwner[_owners[i]] = true;
        }
        owners = _owners;
        required = _required;
    }

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload. function call + parameters
    /// @return transactionId Returns transaction ID.
    function submitTransaction(address destination, uint value, bytes memory data)
    public
    returns (uint transactionId)
    {
        require(isOwner[msg.sender]);
        transactionId = addTransaction(destination, value, data);
        confirmTransaction(transactionId);
        return transactionId;
    }
    /// @dev Allows an owner to confirm a transaction.
    /// @param transactionId Transaction ID.
    function confirmTransaction(uint transactionId)
    public
    {
        require(isOwner[msg.sender], "should be owner");
        require(transactions[transactionId].destination != address(0));
        require(confirmations[transactionId][msg.sender] == false); // not yet voted
        confirmations[transactionId][msg.sender] = true;
        emit Confirmation(msg.sender, transactionId);
        executeTransaction(transactionId);
    }
    /// @dev Allows an owner to revoke a confirmation for a transaction.
    /// @param transactionId Transaction ID.
    // TODO function revokeConfirmation(uint transactionId) public {}

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint transactionId)
    public
    {
        require(transactions[transactionId].executed == false, "Transaction was already executed");

        if (isConfirmed(transactionId)) {
            Transaction storage t = transactions[transactionId];
            t.executed = true;
            // delegate call - call function at destination t.destination with t.value and t.data as payload (function + parameter + msg.sender)
            (bool success, bytes memory rdata) = t.destination.call{value: t.value}(t.data);
            if (success)
                emit Execution(transactionId, rdata);
            else {
                emit ExecutionFailure(transactionId, rdata);
                t.executed = false;
            }
        }

    }
    /*
     * (Possible) Helper Functions
     */
    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(uint transactionId)
    public
    view
    returns (bool)
    {
        // check if we have required confirmations of owners, if so return true
        uint count = 0;
        for (uint i=0; i<owners.length; i++) {
            if (confirmations[transactionId][owners[i]])
                count += 1;
            if (count == required)
                return true;
        }
        return false;
    }

    /// @dev Returns the current amount of owners.
    /// @return Confirmation status.
    function getNumOfOwners()
    public
    view
    returns (uint)
    {
        return owners.length;
    }

    // add new owners

    /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @return transactionId Returns transaction ID.
    function addTransaction(address destination, uint value, bytes memory data)
    internal
    //TODO add check if transaction already existing
    returns (uint transactionId)
    {
        transactionId = transactionCount;
        transactions[transactionId] = Transaction({
        destination: destination,
        value: value,
        data: data,
        executed: false
        });
        transactionCount += 1;
        emit Submission(transactionId);
        return transactionId;
    }

    function getTransactionBy(uint transactionId)
    public
        //TODO add check if transaction already existing
    returns (uint, address, uint256, bytes memory, bool)
    {
        Transaction storage trans =  transactions[transactionId];
        return (transactionId, trans.destination, trans.value, trans.data, trans.executed);
    }

    /*****************************************************************
    Modifier
    *****************************************************************/

    modifier validRequirement(uint ownerCount, uint _required) {
        if (_required > ownerCount || _required == 0 || ownerCount == 0)
            revert();
        _;
    }


}