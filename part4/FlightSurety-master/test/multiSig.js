const Test = require('../config/testConfig.js'),
  BigNumber = require('bignumber.js'),
  Util = require('./util.js');

const SimpleStorage = artifacts.require("SimpleStorage");

contract('MultiSig Voting', async (accounts) => {

  var config;
  let simpleStorage = null;
  let encoded = "0x60fe47b10000000000000000000000000000000000000000000000000000000000000005";
  before('setup contract', async () => {
    config = await Test.Config(accounts);
    simpleStorage = await SimpleStorage.new();
    console.log("Applied web3.version", web3.version);
    console.log("config.multiSignatureWallet adr: ", config.multiSignatureWallet.address);
    console.log("config.simpleStorage adr: ", simpleStorage.address);


    /*
    (config.flightSuretyData).events.allEvents({
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, event){ console.log(event); })
      .on('data', function(event){
        console.log(event); // same results as the optional callback above
      })
      .on('changed', function(event){
        // remove event from local database
      })
      .on('error', console.error);
*/


  });


  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`check balance`, async function () {

    let balanceApp = await web3.eth.getBalance(config.multiSignatureWallet.address);
    let balanceAcc9 = await web3.eth.getBalance(accounts[1]);
    console.log("\t\tmultiSignatureWallet balance:", balanceApp)
    console.log("\t\tacc9 balance:", balanceAcc9);
  });

  it(`test functions in simpleStorage`, async function () {
    // Get operating status
    let result = await simpleStorage.storedData.call();
    assert.equal(result, 0, "Test Setter does not work");
    await simpleStorage.set(3, {from: config.firstAirline});
    let result2 = await simpleStorage.storedData.call();
    assert.equal(result2, 3, "Test Setter does not work");
  });

  it(`test setting directly simpleStorage set(uint256 x) with 5`, async function () {
    // Get operating status
    let result = await simpleStorage.storedData.call();
    assert.equal(result, 3, "Test Setter does not work");
    console.log("result", result)

    try {
      // works
      await config.multiSignatureWallet.directExecution(simpleStorage.address, 0, encoded, {from: config.firstAirline});
    }
    catch(e) {
      //fail= true;
      console.log("\t\terror in submission", e)
    }

    let result2 = await simpleStorage.storedData.call();
    console.log("result2", result2)
    assert.equal(result2, 5, "Test Setter does not work");

  });

  it(`voting`, async function () {

    /*
        function checkAbi()
    external
    pure
    returns (bytes memory)
    {
       return abi.encodeWithSignature("set(uint256)", 5);
    }

     */
    // check bytes: 0x60fe47b10000000000000000000000000000000000000000000000000000000000000005
    // calls multiSignatureWallet.set(5)
    // Get operating status
    let result = await simpleStorage.storedData.call();
    assert.equal(result, 3, "Test Setter does not work");
    let transactionCount  = await config.multiSignatureWallet.transactionCount.call();
    assert.equal(transactionCount, 0, "Test Setter does not work");

    try {
      await config.multiSignatureWallet.submitTransaction(simpleStorage.address, 0, encoded, {from: config.firstAirline})
    }
    catch(e) {
      //fail= true;
      console.log("\t\terror in submission", e)
    }
    transactionCount  = await config.multiSignatureWallet.transactionCount.call();
    assert.equal(transactionCount, 1, "Test Setter does not work");

    let trans  = await config.multiSignatureWallet.getTransactionBy.call(1);
    console.log("\t\tresult trans", trans );

    let result2 = await simpleStorage.storedData.call();
    console.log("\t\tresult storedData", result2 )
    assert.equal(result2, 5, "Test Setter does not work");
  });

  it(`(MultiSignature) isTransactionAvailable for non-existing transaction`, async function () {
    let isTransactionAvailable  = await config.multiSignatureWallet.isTransactionAvailable.call(simpleStorage.address, 5, encoded, {from: config.firstAirline});
    assert.equal(isTransactionAvailable, false, "Test Setter does not work");
  });

  it(`(MultiSignature) isTransactionAvailable for existing transaction`, async function () {
    let isTransactionAvailable  = await config.multiSignatureWallet.isTransactionAvailable.call(simpleStorage.address, 0, encoded, {from: config.firstAirline});
    assert.equal(isTransactionAvailable, true, "Transaction is not available");
  });

  it(`(MultiSignature) TransactionId for non-existing transaction`, async function () {
    let isTransactionId  = await config.multiSignatureWallet.getTransactionId.call(simpleStorage.address, 3, encoded, {from: config.firstAirline});
    assert.equal(isTransactionId, 0, "Test Setter does not work");
  });

  it(`(MultiSignature) TransactionId for existing transaction`, async function () {
    let isTransactionId  = await config.multiSignatureWallet.getTransactionId.call(simpleStorage.address, 0, encoded, {from: config.firstAirline});
    assert.equal(isTransactionId, 1, "Transaction is not available");
  });

  it(`(MultiSignature) Get archived transaction`, async function () {
    let result  = await config.multiSignatureWallet.archiveTransactions.call(1, {from: config.firstAirline});
    console.log("archived transaction", result);
    //assert.equal(isTransactionId, 1, "Transaction is not available");
  });

});
