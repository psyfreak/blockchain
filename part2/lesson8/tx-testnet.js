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
let urlTestRinkeby = "https://rinkeby.infura.io/v3/d9e5d95ca8ab4661b173422d152485fd",
  urlLocal = "HTTP://127.0.0.1:7545"
let web3 = new Web3(urlTestRinkeby);

// -- Step 2: Set the sending and receiving addresses for the transaction.
const sendingAddress = '0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A', // first account meta
  privateKeySender = 'ada3b02c027a70ae9769e5c5303f3cdcae856fbe740d075f7ca37ac51ccdf926', //priv meta
  receivingAddress = '0x9673923a50C96BE52001191ca478821946548F29',
  GAS_PRICE = 20000000// recipient met

// -- Step 4: Set up the transaction using the transaction variables as shown
let rawTransaction = {
  nonce: 0,
  from: sendingAddress,
  to: receivingAddress,
  gasLimit: 30000,//21000 // FIXME gas
  gasPrice:  20000000000, // 10-15 gwei should be ok The price of gas for this transaction in wei, defaults to web3.eth.gasPrice
  value: web3.utils.toBN(web3.utils.toWei("1","gwei"))
};
console.log("rawTransaction", rawTransaction)
//showBalance(sendingAddress, receivingAddress)
signAndSendTX(rawTransaction, sendingAddress, privateKeySender);


function showBalance(sending, receiving) {
  console.log("sending");
  web3.eth.getBalance(sending).then(console.log);
  console.log("receiving");
  web3.eth.getBalance(receiving).then(console.log);
}


// -- Step 7: Sign the transaction with the Hex value of the private key of the sender
async function signAndSendTX(rawTransaction, fromAddress, privKeySender) {
  const txnCount = await web3.eth.getTransactionCount(fromAddress);
  console.log("txnCount", txnCount);
  rawTransaction.nonce = txnCount;
  const privateKeySenderHex = new Buffer(privKeySender, 'hex') ;
  let transaction = new EthereumTx.Transaction(rawTransaction, { chain: "rinkeby" }); // TODO changed for rinkeby
  console.log("sign");
  let txObj = await transaction.sign(privateKeySenderHex);
  console.log("txObj",  txObj);
  //console.log("serialize",  transaction.validate(true));
  // -- Step 8: Send the serialized signed transaction to the Ethereum network.


  let serTx = transaction.serialize();
  console.log("serTx", serTx);
  console.log("serTx", serTx.toString("hex"));

  //let serializedTransaction = "0x" + transaction.serialize().toString("hex"); //transaction.serialize();
  let serializedTransaction = "0x" + serTx.toString("hex"); // TODO changed for rinkeby / in ganache only serTx works
  console.log("sendSignedTransaction", serializedTransaction);

  /*
  // from https://web3js.readthedocs.io/en/v1.4.0/web3-eth.html#sendsignedtransaction
  https://web3js.readthedocs.io/en/v1.4.0/web3-eth.html#sendtransaction details on data fields
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
.on('receipt', console.log);
   */

  web3.eth.sendSignedTransaction(serializedTransaction)
    .on("transactionHash", function(txHash) {
      // show tx hash ?
      console.log("transactionHash:" + txHash);
    })
    .on("receipt", function(receipt) {
      console.log("receipt:", receipt);
    })
    .on("confirmation", function(confirmationNumber, receipt) {
      if (confirmationNumber >= 1) {
        // message that tx went ok
        console.log("tx Ok:", confirmationNumber);// increasing for each node confirms tx.
      } else {
        console.log("tx error:", confirmationNumber);
      }
    })
    .on("error", function(error) {
      console.log("error sending ETH", error);
    });
  //web3.eth.getBalance(sendingAddress).then(console.log);
  //web3.eth.getBalance(receivingAddress).then(console.log)
};

/*
// sample output on rinkeby
transactionHash:0x6fbc86e3a754230bd0ecc1f39fb9c1b8e2a8cb8efc47b8fe1fdebe65f458b0bc
tx error: 0
receipt: {
  blockHash: '0xed57a90bf2a0defcc6abf2444b2ad53a82745304eb9a8345dc53859ff77969db',
  blockNumber: 9007968,
  contractAddress: null,
  cumulativeGasUsed: 71967,
  effectiveGasPrice: '0x4a817c800',
  from: '0x0b942ab0761f6aabed2de1d6fe64138942b6904a',
  gasUsed: 21000,
  logs: [],
  logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000000000000000',
  status: true,
  to: '0x9673923a50c96be52001191ca478821946548f29',
  transactionHash: '0x6fbc86e3a754230bd0ecc1f39fb9c1b8e2a8cb8efc47b8fe1fdebe65f458b0bc',
  transactionIndex: 1,
  type: '0x0'
}
tx Ok: 1
tx Ok: 2
tx Ok: 3
tx Ok: 4
tx Ok: 5
tx Ok: 6
tx Ok: 7
tx Ok: 8
tx Ok: 9

 */
