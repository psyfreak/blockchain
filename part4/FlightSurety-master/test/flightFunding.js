const Test = require('../config/testConfig.js'),
  BigNumber = require('bignumber.js'),
  Util = require('./util.js');

contract('Flight Surety - Funding', async (accounts) => {

  let config;
  let FLIGHT_NAME = "",
    FLIGHT_timestamp = "",
    REFUND_AIRLINE = 50,
    FUND_CONTRACT = 20;


  before('setup contract', async () => {
    config = await Test.Config(accounts);
    FLIGHT_NAME = config.flights[0].name;
    FLIGHT_timestamp = config.flights[0].departure;

    await Util.helper.printBaseInfo(config);

    await Util.helper.printAllAirlines(config, accounts);

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

  after('after contract', async () => {

    await Util.helper.printAllAirlines(config, accounts);

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

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`isRegisteredAirline`, async function () {

    // Get operating status
    let numOfAirlines = await config.flightSuretyData.numOfAirlines.call();
    assert.equal(numOfAirlines, 1, "Incorrect initial numOfAirlines status value");

    let result = await config.flightSuretyData.isAirlineRegistered.call(config.firstAirline);
    assert.equal(result, true, "Airline should be registered");

    await Util.helper.printAirline(config, config.firstAirline);

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

    await Util.helper.printAirline(config, newAirline);

    // ASSERT
    //assert.equal(fail, true, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('(airline) can fund a registered airline via app contract', async () => {

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

    // ASSERT
    assert.equal(fail, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  /*
  // to test directly
  it('(airline) can fund a registered airline directly to data contract', async () => {

    // ARRANGE
    let registeredAirline = accounts[2];


    let result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline);
    //assert.equal(result, false, "Airline is already funded");

    let fail = false;
    try {
      await config.flightSuretyData.fundAirline(registeredAirline, {from: registeredAirline, value: 50});
    }
    catch(e) {
      fail = true;
    }
    result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline);
    assert.equal(result, true, "Airline is not funded");

    // ASSERT
    assert.equal(fail, false, "Airline should not be able to register another airline if it hasn't provided funding");

  });
  */
  it('(airline) Funded airline can do refund with ' + REFUND_AIRLINE, async () => {

    // ARRANGE
    let registeredAirline = accounts[2];
    await Util.helper.printAirline(config, registeredAirline);

    let result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline);
    assert.equal(result, true, "Airline is not funded");

    let fail = false;
    try {
      await config.flightSuretyApp.fundAirline({from: registeredAirline, value: REFUND_AIRLINE});
    }
    catch(e) {
      console.log("fundAirline error", e)
      fail = true;
    }
    // ASSERT
    assert.equal(fail, false, "Funded Airline should be able to refund");

    await Util.helper.printAirline(config, registeredAirline);
  });

  it('(funding) Fund contract ' + REFUND_AIRLINE, async () => {
    // ARRANGE
    let fundSender = accounts[0];
    await Util.helper.printBalance(config,"before", fundSender);

    let fail = false;
    try {
      //await config.flightSuretyApp.call({from: registeredAirline, value: 20});
      await web3.eth.sendTransaction({to: config.flightSuretyApp.address, from: fundSender, value: FUND_CONTRACT})
    }
    catch(e) {
      console.log("fundAirline error", e)
      fail = true;
    }
    // ASSERT
    assert.equal(fail, false, "Funding contract should work");
    await Util.helper.printBalance(config,"after", fundSender);
  });

  it(`(Oracles) can register an Oracle using funds`, async function () {
    /*
    let newOracle = await flightSuretyApp.methods
      .registerOracle()
      .send({from: global.accounts[0], value: 11, gas: 2800707 });
    */
    let fail = false;
    try {
      await config.flightSuretyApp.registerOracle({from: accounts[1], value: 10, gas: 2800707 });
    }
    catch(e) {
      fail= true;
      console.log("first flight fail, which should not be the case", e)
    }
    // ASSERT
    assert.equal(fail, false, "First Flight could not been registered");
  });

  /*
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
*/
});



