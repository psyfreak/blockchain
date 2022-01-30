// how to sep https://www.alxolr.com/articles/how-to-separate-mocha-tests-in-multiple-files
const Test = require('../config/testConfig.js'),
  BigNumber = require('bignumber.js'),
  Util = require('./util.js');

contract('Flight Surety Multiparty', async (accounts) => {

  let config;
  let FLIGHT_NAME = "",
    FLIGHT_timestamp = "",
    INSURANCE_PAYMENT = 100,
    ROI_PAYMENT = 150;

  before('setup contract', async () => {
    config = await Test.Config(accounts);
    FLIGHT_NAME = config.flights[0].name;
    FLIGHT_timestamp = config.flights[0].departure;

    await Util.helper.printBaseInfo(config);
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

// Monitor Events
    config.flightSuretyData.AirlineFunded({ fromBlock: 0,
      //toBlock: 'latest'
    }, (error, result) => {
      if(error) console.error(error);
      //console.log(result)
     // console.log(`[TESTER] => [message] : ${result.args.message} [status] : ${result.args.status}`);
    });

    /*
    events.watch((error, result) => {
      console.log("event", result)
      if (result.event === 'OracleRequest') {
        console.log(`\n\nOracle Requested: index: ${result.args.index.toNumber()}, flight:  ${result.args.flight}, timestamp: ${result.args.timestamp.toNumber()}`);
      } else {
        console.log(`\n\nFlight Status Available: flight: ${result.args.flight}, timestamp: ${result.args.timestamp.toNumber()}, status: ${result.args.status.toNumber() == ON_TIME ? 'ON TIME' : 'DELAYED'}, verified: ${result.args.verified ? 'VERIFIED' : 'UNVERIFIED'}`);
      }
    });
    */
    //await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);


  });

  beforeEach('setup contract', async () => {
    config = await Test.Config(accounts);
    await Util.helper.printBalance(config, "before");
    await Util.helper.printAmounts(config, "before");
  });
  afterEach('setup contract', async () => {
    /*
    config = await Test.Config(accounts);
    await Util.helper.printBalance(config, "after");
    await Util.helper.printAmounts(config, "after");
    */
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  //TODO add consensus tests...
  ///////////////////////// authentication
  it(`(authentication) can call isOperational() via AppContract from owner`, async function () {
    // Get operating status
    let status = await config.flightSuretyApp.isOperational.call({ from: config.testAddresses[9] });
    assert.equal(status, true, "Incorrect initial operating status value");
  });
  //flightSuretyDataInstance.isCallerAuthorized(flightSuretyAppInstance.address)

  it(`(authentication) can call isOperational() via AppContract from firstAirline`, async function () {
    // Get operating status
    let status = await config.flightSuretyApp.isOperational.call({ from: config.firstAirline });
    assert.equal(status, true, "Incorrect initial operating status value");
  });

  it(`(authentication) can call isOperational() via AppContract from unauthorized address`, async function () {
    // Get operating status
    let status = await config.flightSuretyApp.isOperational.call({ from: config.testAddresses[2] });
    assert.equal(status, true, "Incorrect initial operating status value");
  });

  //DATA CONTRACT

  it(`(authentication) can call isOperational() via DataContract from owner`, async function () {
    // Get operating status
    let status = await config.flightSuretyData.isOperational.call({ from: config.testAddresses[9] });
    assert.equal(status, true, "Incorrect initial operating status value");
  });
/*
// is operational is not restricted by authorized require anymore ...
  it(`(authentication) block call isOperational() via DataContract from firstAirline`, async function () {
    // Get operating status
    // working for synch calls
    //assert.throws(() => config.flightSuretyData.isOperational.call({ from: config.firstAirline }), Error, "Error thrown");

    await expectThrowsAsync(() => config.flightSuretyData.isOperational.call({ from: config.firstAirline }), "Returned error: VM Exception while processing transaction: revert Caller is not authorized")
    //assert.equal(status, true, "Incorrect initial operating status value");
  });

  it(`(authentication) can call isOperational() via DataContract from unauthorized address`, async function () {
    // Get operating status
    await expectThrowsAsync(() => config.flightSuretyData.isOperational.call({ from: config.testAddresses[2] }))
  });

 */

  ///////////////////////// multiparty
  it(`(multiparty) has correct initial isOperational() value (DataContract)`, async function () {
    // access from firstAirline / currently added as authorized caller in Data contract ctor
    let status = await config.flightSuretyData.isOperational.call({ from: config.firstAirline });
    assert.equal(status, true, "Incorrect initial operating status value");
  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });


});

const expectThrowsAsync = async (method, errorMessage) => {
  let error = null
  try {
    await method()
  }
  catch (err) {
    error = err
  }
  expect(error).to.be.an('Error')
  if (errorMessage) {
    expect(error.message).to.equal(errorMessage)
  }
}
