// how to sep https://www.alxolr.com/articles/how-to-separate-mocha-tests-in-multiple-files
const Test = require('../config/testConfig.js'),
  BigNumber = require('bignumber.js'),
  Util = require('./util.js');

contract('Flight Surety - Passengers', async (accounts) => {

  let config;
  let FLIGHT_NAME = "",
    FLIGHT_timestamp = "",
    ROI_MULTI = 1.5,
    INSURANCE_PAYMENT = web3.utils.toWei('1', 'ether'), //TODO use config
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
    //let result = await config.flightSuretyData.getAirline.call(config.firstAirline);
    //console.log("getAirline", result['3'].toString())
    await Util.helper.printAirline(config,config.firstAirline )
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

  // preconditions + check

  it('(flight) registerFlight for airline', async () => {

    // ARRANGE
    let airline = config.firstAirline,
      fail = false;
    // ACT
    let isRegistered = await config.flightSuretyData.isAirlineRegistered.call(airline);
    let isFunded = await config.flightSuretyData.isAirlineFunded.call(airline);

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


  it('(passenger) register Passenger for flight', async () => {
    let passenger = accounts[8],
      notonBoard = accounts[6],
      airline = config.firstAirline,
      fail = false;

    try {
      await config.flightSuretyApp.bookFlight(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passenger});

      let isRegistered = await config.flightSuretyData.isPassengerRegistered.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passenger);
      assert.equal(isRegistered, true, "Passenger is missing.");
      let notRegistered = await config.flightSuretyData.isPassengerRegistered.call(airline, FLIGHT_NAME, FLIGHT_timestamp, notonBoard);
      assert.equal(notRegistered, false, "Beware a psycho blind passenger .");
    }
    catch(e) {
      //console.log("error registerFlight", e)
      fail= true;
      console.log("\t\terror", e);
    }
    assert.equal(fail, false, "Error in book flight.");

    await Util.helper.printFlight(config, airline, FLIGHT_NAME, FLIGHT_timestamp);

  });

  it('(passenger) purchase insurance for flight', async () => {
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

  it('(passenger) check for passenger without insurance purchase insurance for flight for p', async () => {
    let passengerWithoutInsurance = accounts[7],
      airline = config.firstAirline,
      fail = false;

    try {
      await config.flightSuretyApp.bookFlight(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passengerWithoutInsurance});

      //await config.flightSuretyApp.buyFlightInsurance(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passengerWithoutInsurance, value: 1000});
      //let numOfInsurees = await config.flightSuretyData.getAmountOfFlightInsurees.call(airline, FLIGHT_NAME, FLIGHT_timestamp);
      //console.log("numOfInsurees", numOfInsurees)

      let notInsured = await config.flightSuretyData.isPassengerInsured.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerWithoutInsurance);
      assert.equal(notInsured, false, "Passenger is not on board, but is insured, but it should not.");
    }
    catch(e) {
      //console.log("error registerFlight", e)
      fail= true;
      console.log("\t\terror", e)
    }
    assert.equal(fail, false, "Error in book flight.");

  });

  it('(passenger) block purchase insurance for non-passenger', async () => {
    let notonBoard = accounts[6],
      airline = config.firstAirline,
      fail = false;
    let onBoardAndNotInsured = await config.flightSuretyData.isPassengerInsured.call(airline, FLIGHT_NAME, FLIGHT_timestamp, notonBoard);
    assert.equal(onBoardAndNotInsured, false, "Passenger is onboard and insured, but it should not.");

    try {

      // cannot purchase insurance because not on board, but nice gambling idea...
      await config.flightSuretyApp.buyFlightInsurance(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: notonBoard, value: 1000});
    }
    catch(e) {
      //console.log("error registerFlight", e)
      fail= true;
      //console.log(e.reason)
    }
    assert.equal(fail, true, "Error in book flight.");

  });

  it('(passenger) processFlightStatus', async () => {
    let passengerOnBoard = accounts[8],
      airline = config.firstAirline,
      fail = false;

    Util.helper.printPassenger(config, passengerOnBoard);

    let retInsurance = await config.flightSuretyData.getInsurance.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    console.log("\t\tretInsurance", retInsurance);
    assert.equal(retInsurance['2'], false, "Insurance was already deposited.");
    //assert.equal(retInsurance, 0, "Passenger is still insured.");
    let isInsured = await config.flightSuretyData.isPassengerInsured.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    assert.equal(isInsured, true, "Passenger is not insured.");

    try {
      // normally fct. is internal, but for testing purpose
      await config.flightSuretyApp.processFlightStatus(airline, FLIGHT_NAME, FLIGHT_timestamp, 20, {from: passengerOnBoard});
      //await config.flightSuretyApp.processFlightStatus(airline, FLIGHT_NAME, FLIGHT_timestamp, 10, {from: passengerOnBoard, value: 1000});
    }
    catch(e) {
      console.log("\t\terror processFlightStatus", e)
      fail= true;
      //console.log(e)
    }
    assert.equal(fail, false, "Error in processFlightStatus");

    retInsurance = await config.flightSuretyData.getInsurance.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    console.log("\t\tgetInsurance", retInsurance);
    assert.equal(retInsurance['2'], true, "Insurance was deposited.");

    isInsured = await config.flightSuretyData.isPassengerInsured.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    assert.equal(isInsured, true, "Passenger is not insured.");

    Util.helper.printPassenger(config, passengerOnBoard);

  });

  it('(passenger) withdraw', async () => {
    let passengerOnBoard = accounts[8],
      airline = config.firstAirline,
      fail = false;

    let payout = await config.flightSuretyData.getPayoutForInsuree.call(passengerOnBoard);
    assert.equal(payout, ROI_PAYMENT, "Payout should be 1.5x of " + INSURANCE_PAYMENT);
    Util.helper.printPassenger(config, passengerOnBoard);
    Util.helper.printBalance(config, passengerOnBoard);

    try {
      // normally fct. is internal, but for testing purpose
      await config.flightSuretyApp.withdraw({from: passengerOnBoard});
      //await config.flightSuretyApp.processFlightStatus(airline, FLIGHT_NAME, FLIGHT_timestamp, 10, {from: passengerOnBoard, value: 1000});
    }
    catch(e) {
      console.log("\t\tgerror withdraw", e)
      fail= true;
      //console.log(e)
    }
    assert.equal(fail, false, "Error in withdrawInsuree");

    payout = await config.flightSuretyData.getPayoutForInsuree.call(passengerOnBoard);
    assert.equal(payout, 0, "Payout should be zero after withdrawing.");

    Util.helper.printBalance(config, passengerOnBoard);
  });
});