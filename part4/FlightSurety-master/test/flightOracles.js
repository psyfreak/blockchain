const Test = require('../config/testConfig.js'),
  BigNumber = require('bignumber.js'),
  Util = require('./util.js');

contract('Flight Surety - Oracles', async (accounts) => {

  let config;
  let FLIGHT_NAME = "",
    FLIGHT_timestamp = "",
    predefinedOracleIds =[],
    ROI_MULTI = 1.5,
    INSURANCE_PAYMENT = 10,
    INSURANCE_PAYMENT2 = 15,
    STATUS_CODE=20,
    ROI_PAYMENT = INSURANCE_PAYMENT*ROI_MULTI;

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

    //await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);

    // oracleCount

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

  it('(Oracles) registerFlight for airline + do it again fail', async () => {
    // ARRANGE
    let airline = config.firstAirline,
      fail = false;
    // ACT
    let isRegistered = await config.flightSuretyData.isAirlineRegistered.call(airline);
    let isFunded = await config.flightSuretyData.isAirlineFunded.call(airline);
    console.log("\t\tairline: " + airline + " isRegistered: " + isRegistered + " isFunded" + isFunded);

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

  it('(passenger) register first Passenger for flight', async () => {
    let passenger = accounts[8],
      airline = config.firstAirline,
      fail = false;

    try {
      await config.flightSuretyApp.bookFlight(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passenger});

      let isRegistered = await config.flightSuretyData.isPassengerRegistered.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passenger);
      assert.equal(isRegistered, true, "Passenger is missing.");
    }
    catch(e) {
      //console.log("error registerFlight", e)
      fail= true;
      console.log(e)
    }
    assert.equal(fail, false, "Error in book flight.");

    await Util.helper.printFlight(config, airline, FLIGHT_NAME, FLIGHT_timestamp);

  });

  it('(passenger) register second Passenger for flight', async () => {
    let passenger = accounts[7],
      airline = config.firstAirline,
      fail = false;

    try {
      await config.flightSuretyApp.bookFlight(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passenger});

      let isRegistered = await config.flightSuretyData.isPassengerRegistered.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passenger);
      assert.equal(isRegistered, true, "Passenger is missing.");
    }
    catch(e) {
      //console.log("error registerFlight", e)
      fail= true;
      console.log(e)
    }
    assert.equal(fail, false, "Error in book flight.");

    await Util.helper.printFlight(config, airline, FLIGHT_NAME, FLIGHT_timestamp);

  });

  it('(passenger) purchase insurance for flight for first passenger', async () => {
    let passengerOnBoard = accounts[8],
      airline = config.firstAirline,
      fail = false;

    try {
      // test case for cap
      //await config.flightSuretyApp.buyFlightInsurance(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passengerOnBoard, value: 1000});
      await config.flightSuretyApp.buyFlightInsurance(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passengerOnBoard, value: INSURANCE_PAYMENT});
    }
    catch(e) {
      //console.log("error registerFlight", e)
      fail= true;
    }
    assert.equal(fail, false, "Error in buyFlightInsurance flight.");


    let numOfInsurees = await config.flightSuretyData.getAmountOfFlightInsurees.call(airline, FLIGHT_NAME, FLIGHT_timestamp);
    //console.log("numOfInsurees", numOfInsurees)
    let retInsurance = await config.flightSuretyData.getInsurance.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    //console.log("retInsurance", retInsurance)

    let isInsured = await config.flightSuretyData.isPassengerInsured.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    assert.equal(isInsured, true, "Passenger is not insured, but it should.");

  });
  it('(passenger) purchase insurance for flight for second passenger', async () => {
    let passengerOnBoard = accounts[7],
      airline = config.firstAirline,
      fail = false;

    try {
      // test case for cap
      //await config.flightSuretyApp.buyFlightInsurance(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passengerOnBoard, value: 1000});
      await config.flightSuretyApp.buyFlightInsurance(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passengerOnBoard, value: INSURANCE_PAYMENT2});
    }
    catch(e) {
      //console.log("error registerFlight", e)
      fail= true;
    }
    assert.equal(fail, false, "Error in buyFlightInsurance flight.");


    let numOfInsurees = await config.flightSuretyData.getAmountOfFlightInsurees.call(airline, FLIGHT_NAME, FLIGHT_timestamp);
    //console.log("numOfInsurees", numOfInsurees)
    let retInsurance = await config.flightSuretyData.getInsurance.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    //console.log("retInsurance", retInsurance)

    let isInsured = await config.flightSuretyData.isPassengerInsured.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    assert.equal(isInsured, true, "Passenger is not insured, but it should.");

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
      await config.flightSuretyApp.registerOracle({from: accounts[10], value: 0 });
    }
    catch(e) {
      fail= true;
      //console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, true, "Oracle should not be registered w/o funds");

  });

  it(`(Oracles) get indices of my oracle`, async function () {

    let result = await config.flightSuretyApp.getMyIndexes({from: accounts[0] });

    predefinedOracleIds = result.map(x => x.toString());
    console.log("getIndex oracles: ", predefinedOracleIds);
  });

  it(`(Oracles) get no indices of non-owned oracle`, async function () {
    let fail = false;
    try {
      await config.flightSuretyApp.getMyIndexes({from: accounts[10] });
    }
    catch(e) {
      fail= true;
      //console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, true, "First Flight could not been registered");
  });

  it(`(Oracles) fetch flight status`, async function () {
    // create flight with firstAirline
    console.log("\t index = " + predefinedOracleIds[0])
    let fail = false;
    try {
      await config.flightSuretyApp.fetchFlightStatus(config.firstAirline, FLIGHT_NAME, FLIGHT_timestamp, predefinedOracleIds[0]);
    }
    catch(e) {
      fail= true;
      console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, false, "First Flight could not been registered");

  });

  it(`(Oracles) check response entries`, async function () {
    let responseOracleEntry = await config.flightSuretyApp.getResponses.call(predefinedOracleIds[0], config.firstAirline, FLIGHT_NAME, FLIGHT_timestamp, STATUS_CODE);
    console.log("\t\tresponseOracleEntry", responseOracleEntry);
  });
  // beware while the server is running it listens to the fetch events, therefore this will be already executed.
  it(`(Oracles) submit Response`, async function () {
    console.log("\t index = " + predefinedOracleIds[0])
    const STATUS_CODE = 20;
    let passenger1 = accounts[8],
      passenger2 = accounts[7];
    await Util.helper.printPassenger(config, passenger1);
    await Util.helper.printPassenger(config, passenger2);
    let fail = false;

    try {
      await config.flightSuretyApp.submitOracleResponse(predefinedOracleIds[0], config.firstAirline, FLIGHT_NAME, FLIGHT_timestamp, STATUS_CODE);
    }
    catch(e) {
      fail= true;
      console.log("Submit oracle response could not execute", e)
    }
    // ASSERT
    assert.equal(fail, false, "First Flight could not been registered");
    let responseOracleEntry = await config.flightSuretyApp.getResponses.call(predefinedOracleIds[0], config.firstAirline, FLIGHT_NAME, FLIGHT_timestamp, STATUS_CODE);
    console.log("responseOracleEntry", responseOracleEntry);

    await Util.helper.printPassenger(config, passenger1);
    await Util.helper.printPassenger(config, passenger2);
  });
});



