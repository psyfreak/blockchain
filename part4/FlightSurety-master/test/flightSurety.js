
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');
var Util = require('./util.js');

contract('Flight Surety Tests', async (accounts) => {

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
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);


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

  it(`getAirlineByAddress`, async function () {

     // Get operating status
    let result = await config.flightSuretyData.getAirlineByAddress.call(config.firstAirline);
    console.log("getAirlineByAddress", result['3'].toString())
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
    let isRegistered = await config.flightSuretyData.isAirlineRegistered.call(accounts[1]);
    assert.equal(isRegistered, false, "Airline should not be registered")
  });


  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {

    // ARRANGE
    let unregisteredAirline = accounts[3],
      newAirline = accounts[2];


    let result = await config.flightSuretyData.isAirlineFunded.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
    // ACT


    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(newAirline, {from: unregisteredAirline});
    }
    catch(e) {
      //console.log("registerAirline error", e)
      fail = true;
    }

    // ASSERT
    //assert.equal(fail, true, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('(airline) can register an Airline using funded airline', async () => {

    // ARRANGE
    let registeredAirline = config.firstAirline,
      newAirline = accounts[2];


    let result = await config.flightSuretyData.isAirlineRegistered.call(newAirline);
    assert.equal(result, false, "Airline is registered");
    // ACT


    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(newAirline, {from: registeredAirline});
    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }
    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline);
    assert.equal(result, true, "Airline is not registered");
    result = await config.flightSuretyData.getAirlineByAddress.call(newAirline);
    //console.log("getAirlineByAddress", result)

    // ASSERT
    //assert.equal(fail, true, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('(airline) can not register a further airline if not funded', async () => {

    // ARRANGE
    let registeredAirline = accounts[2],
      newAirline = accounts[3];


    let result = await config.flightSuretyData.isAirlineRegistered.call(registeredAirline);
    assert.equal(result, true, "Airline is registered");
    let result2 = await config.flightSuretyData.isAirlineFunded.call(registeredAirline);
    assert.equal(result2, false, "Airline is registered");
    // ACT


    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(newAirline, {from: registeredAirline});
    }
    catch(e) {
      //console.log("registerAirline error", e)
      fail = true;
    }
    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline);
    assert.equal(result, false, "Airline is not registered");
    result = await config.flightSuretyData.getAirlineByAddress.call(newAirline);
    //console.log("getAirlineByAddress ", result)

    // ASSERT
    assert.equal(fail, true, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('(airline) can fund a registered airline', async () => {

    // ARRANGE
    let registeredAirline = accounts[2];

    let result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline);
    assert.equal(result, false, "Airline is funded");

    let fail = false;
    try {
      await config.flightSuretyApp.fundAirline({from: registeredAirline, value: 10});
    }
    catch(e) {
      console.log("fundAirline error", e)
      fail = true;
    }
    result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline);
    assert.equal(result, true, "Airline is not funded");
    result = await config.flightSuretyData.getAirlineByAddress.call(registeredAirline);
    console.log("getAirlineByAddress ", result)

    // ASSERT
    assert.equal(fail, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('(airline) newly funded airline can register 2 further airlines (=4 in total)', async () => {

    // ARRANGE
    let registeredAirline = accounts[2],
      newAirline3 = accounts[3],
      newAirline4 = accounts[4],
      newAirline5 = accounts[5];

    let result = await config.flightSuretyData.isAirlineRegistered.call(newAirline3);
    assert.equal(result, false, "Airline is registered");
    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline4);
    assert.equal(result, false, "Airline is registered");
    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline5);
    assert.equal(result, false, "Airline is registered");



    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(newAirline3, {from: registeredAirline});
      await config.flightSuretyApp.registerAirline(newAirline4, {from: registeredAirline});
      await config.flightSuretyApp.registerAirline(newAirline5, {from: registeredAirline});
    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }
    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline3);
    assert.equal(result, true, "Airline is not registered");
    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline4);
    assert.equal(result, true, "Airline is not registered");
    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline5);
    assert.equal(result, true, "Airline is not registered");

    assert.equal(fail, false, "Airlines could not be registered");
  });

  it('(airline) newly registered airlines can fund themselves (=4 in total)', async () => {

    // ARRANGE
    let registeredAirline3 = accounts[3],
      registeredAirline4 = accounts[4],
      registeredAirline5 = accounts[5];


    let result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline3);
    assert.equal(result, false, "Airline is funded");
    result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline4);
    assert.equal(result, false, "Airline is funded");
    result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline5);
    assert.equal(result, false, "Airline is funded");




    let fail = false;
    try {
      await config.flightSuretyApp.fundAirline({from: registeredAirline3, value: 10});
      await config.flightSuretyApp.fundAirline({from: registeredAirline4, value: 10});
      await config.flightSuretyApp.fundAirline({from: registeredAirline5, value: 10});

    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }

    result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline3);
    assert.equal(result, true, "Airline is not funded");
    result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline4);
    assert.equal(result, true, "Airline is not funded");
    result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline5);
    assert.equal(result, true, "Airline is not funded");


    assert.equal(fail, false, "Airlines could not be registered");
  });

  it('(airline) cannot register an Airline without further confirmation for the 5th airline ', async () => {

    // ARRANGE
    let unregisteredAirline = accounts[6],
      fundedAirline = accounts[5];


    let result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
    // ACT
    result = await config.flightSuretyData.isAirlineFunded.call(fundedAirline);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");


    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(unregisteredAirline, {from: fundedAirline});
    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }
    // ASSERT
    //assert.equal(fail, true, "Airline should not be able to register another airline if it hasn't provided funding");
    result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");

  });

  it('(airline) can register an Airline with further confirmation for the 5th airline ', async () => {

    // ARRANGE
    let unregisteredAirline = accounts[6],
      fundedAirline2 = accounts[2],
      fundedAirline3 = accounts[3];

    let result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
    // ACT
    result = await config.flightSuretyData.isAirlineFunded.call(fundedAirline2);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
    result = await config.flightSuretyData.isAirlineFunded.call(fundedAirline3);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");


    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(unregisteredAirline, {from: fundedAirline2});
     // await config.flightSuretyApp.registerAirline(unregisteredAirline, {from: fundedAirline3});
    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }
    // ASSERT
    //assert.equal(fail, true, "Airline should not be able to register another airline if it hasn't provided funding");
    result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");

  });


  it(`(multiparty) has correct initial isOperational() value`, async function () {
    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
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

  it('(flight) registerFlight for airline + do it again fail', async () => {

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

  });

  it('(flight) registerFlight flight for unregistered airline should fail', async () => {

    // ARRANGE
    let
      airline = accounts[1],
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
      console.log(e)
    }
    assert.equal(fail, false, "Error in book flight.");

  });

  it('(passenger) purchase insurance for flight', async () => {
    let passengerOnBoard = accounts[8],
      airline = config.firstAirline,
      fail = false;

    try {
      // test case for cap
      //await config.flightSuretyApp.buyFlightInsurance(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passengerOnBoard, value: 1000});
      await config.flightSuretyApp.buyFlightInsurance(airline, FLIGHT_NAME, FLIGHT_timestamp, {from: passengerOnBoard, value: 120});
    }
    catch(e) {
      //console.log("error registerFlight", e)
      fail= true;
      //console.log(e)
    }
    assert.equal(fail, false, "Error in buyFlightInsurance flight.");
    let numOfInsurees = await config.flightSuretyData.getAmountOfFlightInsurees.call(airline, FLIGHT_NAME, FLIGHT_timestamp);
    console.log("numOfInsurees", numOfInsurees)
    let retInsurance = await config.flightSuretyData.getInsurance.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    console.log("retInsurance", retInsurance)

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
      console.log(e)
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


    let payout = await config.flightSuretyData.getPayoutForInsuree.call(passengerOnBoard);
    console.log("passengerOnBoard (balance/payout)", payout);

    let retInsurance = await config.flightSuretyData.getInsurance.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    console.log("retInsurance", retInsurance);

    let isInsured = await config.flightSuretyData.isPassengerInsured.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    assert.equal(isInsured, true, "Passenger is not insured.");


    try {
      // normally fct. is internal, but for testing purpose
      await config.flightSuretyApp.processFlightStatus(airline, FLIGHT_NAME, FLIGHT_timestamp, 20, {from: passengerOnBoard});
      //await config.flightSuretyApp.processFlightStatus(airline, FLIGHT_NAME, FLIGHT_timestamp, 10, {from: passengerOnBoard, value: 1000});
    }
    catch(e) {
      console.log("error processFlightStatus", e)
      fail= true;
      //console.log(e)
    }
    assert.equal(fail, false, "Error in processFlightStatus");

    payout = await config.flightSuretyData.getPayoutForInsuree.call(passengerOnBoard);
    console.log("passengerOnBoard (balance/payout)", payout);
    retInsurance = await config.flightSuretyData.getInsurance.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    console.log("retInsurance", retInsurance)

    isInsured = await config.flightSuretyData.isPassengerInsured.call(airline, FLIGHT_NAME, FLIGHT_timestamp, passengerOnBoard);
    assert.equal(isInsured, false, "Passenger is still insured.");
  });
});


var helper = {
  printAmounts: async function(config) {
    let total = await config.flightSuretyData.numOfAirlines.call();
    let registered = await config.flightSuretyData.numOfRegisteredAirlines.call();
    let funded = await config.flightSuretyData.numOfFundedAirlines.call();
    console.log(`Airlines (total/registered/funded): ${total.toString()} / ${registered.toString()} / ${funded.toString()} `)
  },
  printPassenger: async function(config) {
    let total = await config.flightSuretyData.numOfAirlines.call();
    let registered = await config.flightSuretyData.numOfRegisteredAirlines.call();
    let funded = await config.flightSuretyData.numOfFundedAirlines.call();
    console.log(`Airlines (total/registered/funded): ${total.toString()} / ${registered.toString()} / ${funded.toString()} `)
  }
  // TODO add passenger info
  // TODO add logger for reason only / exceptions
}
