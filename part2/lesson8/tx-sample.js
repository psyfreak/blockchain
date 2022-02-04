/**
 * Lesson 1 - 13.Create Ethereum Transactions
 * see example https://github.com/ethereumjs/ethereumjs-tx
 */

/*##########################

CONFIGURATION
##########################*/

// -- Step 1: Set up the appropriate configuration
const Web3 = require("web3"),
//EthereumTx = require('ethereumjs-tx').Transaction;
 EthereumTx = require("ethereumjs-tx"); //const EthereumTx = require('ethereumjs-tx').Transaction

var web3 = new Web3('HTTP://127.0.0.1:7545')

// -- Step 2: Set the sending and receiving addresses for the transaction.
var sendingAddress = '0x3ff2D686fb4fF41BaC3AA32C56d1f1eb6B519575'; // first account
var receivingAddress = '0x0b26c8a3f3C4a210D719Ebc8f142fEB1f81db290';// second account

// -- Step 3: Check the balances of each address
web3.eth.getBalance(sendingAddress).then(console.log);
web3.eth.getBalance(receivingAddress).then(console.log)

/*##########################

CREATE A TRANSACTION
##########################*/

// -- Step 4: Set up the transaction using the transaction variables as shown
var rawTransaction = {
  nonce: 3,
  to: receivingAddress,
  gasPrice: 20000000,
  gasLimit: 30000,
  value: web3.utils.toBN(web3.utils.toWei("2","ether")),
  data: "0x00"
};

// -- Step 5: View the raw transaction rawTransaction
console.log("rawTransaction", rawTransaction);
// -- Step 6: Check the new account balances (they should be the same)
web3.eth.getBalance(sendingAddress).then(console.log);
web3.eth.getBalance(receivingAddress).then(console.log);

// Note: They haven't changed because they need to be signed...

/*##########################

Sign the Transaction
##########################*/

// -- Step 7: Sign the transaction with the Hex value of the private key of the sender



const privateKeySender = '08e775ef730f38e8dd58052d11f43e9a786ed40a5b0007e09b2bd9755c62d9ae'; //account1
const privateKeySenderHex = new Buffer(privateKeySender, 'hex') ;

// All of these network's params are the same than mainnets', except for name, chainId, and
// networkId, so we use the Common.forCustomChain method.
/*
const customCommon = Common.forCustomChain(
  'mainnet',
  {
    name: 'my-network',
    networkId: 5777,
    chainId: 2134,
  },
  'muirGlacier',
)
 */

let transaction = new EthereumTx.Transaction(rawTransaction);
transaction.sign(privateKeySenderHex)


/*#########################################

Send the transaction to the network
#########################################*/

// -- Step 8: Send the serialized signed transaction to the Ethereum network.
let serializedTransaction = transaction.serialize();
web3.eth.sendSignedTransaction(serializedTransaction).then(res=> {

// -- Step 9: Check the balances of each address after transactions
  console.log("after")
  web3.eth.getBalance(sendingAddress).then(console.log);
  web3.eth.getBalance(receivingAddress).then(console.log)
});

