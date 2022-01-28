
const Test = require('../config/testConfig.js'),
  BigNumber = require('bignumber.js');

const SimpleStorage = artifacts.require("SimpleStorage");

contract('MultiSig Voting', async (accounts) => {

  var config;
  let simpleStorage = null;
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
    let balanceAcc9 = await web3.eth.getBalance(accounts[9]);
    console.log("multiSignatureWallet balance:", balanceApp)
    console.log("acc9 balance:", balanceAcc9);
  });

  it(`test functions in simpleStorage`, async function () {
    // Get operating status
    let result = await simpleStorage.storedData.call();
    console.log("result storedData before", result )
    await simpleStorage.set(3, {from: config.firstAirline});
    let result2 = await simpleStorage.storedData.call();
    console.log("result storedData after ", result2 )
    assert.equal(result2, 3, "Test Setter does not work");
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
    console.log("result storedData", result )
    let encoded = "0x60fe47b10000000000000000000000000000000000000000000000000000000000000005";

    try {
      await config.multiSignatureWallet.submitTransaction(simpleStorage.address, 0, encoded, {from: config.firstAirline})
    }
    catch(e) {
      //fail= true;
      console.log("error in submission", e)
    }
    let transactionCount  = await config.multiSignatureWallet.transactionCount.call();
    console.log("result transactionCount", transactionCount );

    let trans  = await config.multiSignatureWallet.getTransactionBy.call(0);
    console.log("result trans", trans );


    let result2 = await simpleStorage.storedData.call();
    console.log("result storedData", result2 )
    assert.equal(result2, 5, "Test Setter does not work");
  });




});
