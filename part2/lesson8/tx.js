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

let web3 = new Web3('HTTP://127.0.0.1:7545')

// -- Step 2: Set the sending and receiving addresses for the transaction.
const sendingAddress = '0x3ff2D686fb4fF41BaC3AA32C56d1f1eb6B519575', // first account
  privateKeySender = '08e775ef730f38e8dd58052d11f43e9a786ed40a5b0007e09b2bd9755c62d9ae', //account1
  receivingAddress = '0x0b26c8a3f3C4a210D719Ebc8f142fEB1f81db290';// second account

// -- Step 4: Set up the transaction using the transaction variables as shown
let rawTransaction = {
  nonce: 0,
  to: receivingAddress,
  gasPrice: 20000000,
  gasLimit: 30000,
  value: web3.utils.toBN(web3.utils.toWei("1","ether")),
  data: "0x00"
};
signAndSendTX(rawTransaction, sendingAddress, privateKeySender);


function showBalance(sending, receiving) {
  web3.eth.getBalance(sendingAddress).then(console.log);
  web3.eth.getBalance(receivingAddress).then(console.log);
}


// -- Step 7: Sign the transaction with the Hex value of the private key of the sender
async function signAndSendTX(rawTransaction, fromAddress, privKeySender) {
  const txnCount = await web3.eth.getTransactionCount(fromAddress);
  console.log("txnCount", txnCount);
  rawTransaction.nonce = txnCount;
  const privateKeySenderHex = new Buffer(privKeySender, 'hex') ;
  let transaction = new EthereumTx.Transaction(rawTransaction);
  transaction.sign(privateKeySenderHex);
  // -- Step 8: Send the serialized signed transaction to the Ethereum network.
  let serializedTransaction = transaction.serialize();
  await web3.eth.sendSignedTransaction(serializedTransaction);
  web3.eth.getBalance(sendingAddress).then(console.log);
  web3.eth.getBalance(receivingAddress).then(console.log)
};
