
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
var Util = require('./util.js');

contract('Flight Surety - Oracles', async (accounts) => {

  let config;
  let FLIGHT_NAME = "",
    FLIGHT_timestamp = "";


  before('setup contract', async () => {
    config = await Test.Config(accounts);
    FLIGHT_NAME = config.flights[0].name;
    FLIGHT_timestamp = config.flights[0].departure;

    console.log(web3.version);
    console.log("firstAirline", config.firstAirline, "Test flight", FLIGHT_NAME, " departure", FLIGHT_timestamp);
    console.log("config.flightSuretyApp adr: ", config.flightSuretyApp.address);
    console.log("config.flightSuretyData adr: ", config.flightSuretyData.address);


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

    //await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);

    // oracleCount

  });

  beforeEach('setup contract', async () => {
    config = await Test.Config(accounts);
    await Util.helper.printBalance(config);
    await Util.helper.printAmounts(config);
  });
  afterEach('setup contract', async () => {
    config = await Test.Config(accounts);
    await Util.helper.printBalance(config);
    await Util.helper.printAmounts(config);
  });
  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it('(Oracles) registerFlight for airline + do it again fail', async () => {
    // ARRANGE
    let airline = config.firstAirline,
      fail = false;
    // ACT
    let isRegistered = await config.flightSuretyData.isAirlineRegistered.call(airline);
    let isFunded = await config.flightSuretyData.isAirlineFunded.call(airline);
    console.log("airline: " + airline + " isRegistered: " + isRegistered + " isFunded" + isFunded);

    try {
      await config.flightSuretyApp.registerFlight(FLIGHT_NAME, FLIGHT_timestamp, {from: airline});
    }
    catch(e) {
      fail= true;
      //console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, false, "First Flight could not been registered");
  });


  it(`(Oracles) can register an Oracle using funds`, async function () {
    /*
    let newOracle = await flightSuretyApp.methods
      .registerOracle()
      .send({from: global.accounts[0], value: 11, gas: 2800707 });
    */
    let fail = false;
    try {
      await config.flightSuretyApp.registerOracle({from: accounts[0], value: 10, gas: 2800707 });
    }
    catch(e) {
      fail= true;
      console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, false, "First Flight could not been registered");
  });
  it(`(Oracles) block register an Oracle without funds`, async function () {
    let fail = false;
    try {
      await config.flightSuretyApp.registerOracle({from: accounts[1], value: 0 });
    }
    catch(e) {
      fail= true;
      console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, true, "Oracle should not be registered w/o funds");

  });
  it(`(Oracles) get indices of my oracle`, async function () {

    let result = await config.flightSuretyApp.getMyIndexes({from: accounts[0] });
    console.log("getIndex oracles: ", result);
  });
  it(`(Oracles) get no indices of non-owned oracle`, async function () {
    let fail = false;
    try {
      await config.flightSuretyApp.getMyIndexes({from: accounts[1] });
    }
    catch(e) {
      fail= true;
      console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, true, "First Flight could not been registered");
  });

  it(`(Oracles) fetch flight status`, async function () {
    // create flight with firstAirline
    let fail = false;
    try {
      await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, FLIGHT_NAME, FLIGHT_timestamp);
    }
    catch(e) {
      fail= true;
      console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, false, "First Flight could not been registered");

  });
  it(`(Oracles) submit Response`, async function () {


  });

});



