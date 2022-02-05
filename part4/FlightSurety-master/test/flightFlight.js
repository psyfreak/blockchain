// how to sep https://www.alxolr.com/articles/how-to-separate-mocha-tests-in-multiple-files
const Test = require('../config/testConfig.js'),
  BigNumber = require('bignumber.js'),
  Util = require('./util.js');

contract('Flight Surety - Flights', async (accounts) => {

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
    config = await Test.Config(accounts);
    await Util.helper.printBalance(config, "after");
    await Util.helper.printAmounts(config, "after");
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`getAirline`, async function () {
    // Get operating status
    //let result = await config.flightSuretyApp.getAirline.call(config.firstAirline);
    //console.log("getAirline", result['3'].toString())
    await Util.helper.printAirline(config,config.firstAirline);
    //assert.equal(status, true, "Incorrect initial operating status value");
  });

  it(`isAirlineFunded one authorized + non-authroized`, async function () {
    let result = await config.flightSuretyData.isAirlineFunded.call(config.firstAirline);
    assert.equal(result, true, "Airline should be registered")
    result = await config.flightSuretyData.isAirlineFunded.call(accounts[3]);
    assert.equal(result, false, "Airline should not be registered")
  });

  it(`isRegisteredAirline`, async function () {

    // Get operating status
    let numOfAirlines = await config.flightSuretyData.numOfAirlines.call();
    assert.equal(numOfAirlines, 1, "Incorrect initial numOfAirlines status value");

    let result = await config.flightSuretyData.isAirlineRegistered.call(config.firstAirline);
    assert.equal(result, true, "Airline should be registered");
  });
  it(`isNotRegisteredAirline`, async function () {
    let isRegistered = await config.flightSuretyData.isAirlineRegistered.call(accounts[2]);
    assert.equal(isRegistered, false, "Airline should not be registered")
  });

  it('(flight) registerFlight for airline + do it again fail', async () => {

    // ARRANGE
    let airline = config.firstAirline,
      fail = false;
    // ACT
    let isRegistered = await config.flightSuretyData.isAirlineRegistered.call(airline);
    let isFunded = await config.flightSuretyData.isAirlineFunded.call(airline);
    console.log("\t\tairline: " + airline + " isRegistered: " + isRegistered + " isFunded" + isFunded);
    assert.equal(isRegistered, true, "Airline should be registered");
    assert.equal(isFunded, true, "Airline should be funded");

    try {
      await config.flightSuretyApp.registerFlight(FLIGHT_NAME, FLIGHT_timestamp, {from: airline});
    }
    catch(e) {
      fail= true;
      //console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, false, "First Flight could not been registered");
    let isFlightRegistered = await config.flightSuretyData.isFlightRegistered.call(airline, FLIGHT_NAME, FLIGHT_timestamp);
    assert.equal(isFlightRegistered, true, "Flight should be registered now");

    // second time
    fail= false;
    try {
      await config.flightSuretyApp.registerFlight(FLIGHT_NAME, FLIGHT_timestamp, {from: airline});
    }
    catch(e) {
      fail= true;
    }

    // ASSERT
    assert.equal(fail, true, "Second flight could be registered, but should be not allowed.");
    await Util.helper.printFlight(config, airline, FLIGHT_NAME, FLIGHT_timestamp);
  });

  it('(flight) registerFlight flight for unregistered airline should fail', async () => {

    // ARRANGE
    let
      airline = accounts[2],
      flight = 'ND1308', // Course number
      timestamp = Math.floor(Date.now() / 1000),
      fail = false;
    // ACT
    try {
      await config.flightSuretyApp.registerFlight(flight, timestamp, {from: airline});
    }
    catch(e) {
      //console.log("error registerFlight", e)
      fail= true;
    }


    // ASSERT
    assert.equal(fail, true, "Flight could register though airline is not registered.");

  });


});