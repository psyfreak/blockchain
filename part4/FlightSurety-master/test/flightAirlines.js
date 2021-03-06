// how to sep https://www.alxolr.com/articles/how-to-separate-mocha-tests-in-multiple-files
const Test = require('../config/testConfig.js'),
  BigNumber = require('bignumber.js'),
  Util = require('./util.js');

contract('Flight Surety - Airlines', async (accounts) => {

  let config;
  let FLIGHT_NAME = "",
    FLIGHT_AIRLINE = "",
    FLIGHT_timestamp = "",
    FUNDING_AIRLINE = web3.utils.toWei('10', 'ether')// ether; //TODO use config

  before('setup contract', async () => {
    config = await Test.Config(accounts);
    FLIGHT_AIRLINE = config.airlines[1].name;
    FLIGHT_NAME = config.flights[0].name;
    FLIGHT_timestamp = config.flights[0].departure;

    await Util.helper.printBaseInfo(config);
    //await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address);
  });

  beforeEach('setup contract', async () => {
    config = await Test.Config(accounts);
    await Util.helper.printBalance(config, "before");
    await Util.helper.printAmounts(config, "before");
  });
  afterEach('setup contract', async () => {
    config = await Test.Config(accounts);
    //await Util.helper.printBalance(config, "after");
    //await Util.helper.printAmounts(config, "after");
  });
  after('setup contract', async () => {
    await Util.helper.printBalance(config, "after");
    await Util.helper.printAmounts(config, "after");
    await Util.helper.printAllAirlines(config, accounts);
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`getAirline`, async function () {

     // Get operating status
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

  it('(airline) cannot register an Airline using registerAirline() if registree is not registered itself', async () => {

    // ARRANGE
    let unregisteredAirline = accounts[3],
      newAirline = accounts[2];


    let result = await config.flightSuretyData.isAirlineFunded.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
    // ACT

    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(newAirline, config.airlines[2].name, {from: unregisteredAirline});
    }
    catch(e) {
      //console.log("registerAirline error", e)
      fail = true;
    }

    // ASSERT
    assert.equal(fail, true, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  it('(airline) can register an Airline using registered (and funded) airline', async () => {

    // ARRANGE
    let registeredAirline = config.firstAirline,
      newAirline = accounts[2];

    let result = await config.flightSuretyData.isAirlineRegistered.call(newAirline);
    assert.equal(result, false, "Airline is registered");
    // ACT

    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(newAirline, config.airlines[2].name,{from: registeredAirline});
    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }
    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline);
    assert.equal(result, true, "Airline is not registered");
    await Util.helper.printAirline(config, newAirline);
    //console.log("getAirline", result)
    // ASSERT
    //assert.equal(fail, true, "Airline should not be able to register another airline if it hasn't provided funding");

  });

  // issue ....
  it('(airline) a registered (not funded) airline can register a new airline if less than 4 registered airlines', async () => {

    // ARRANGE
    let registeredAirline = accounts[2],
      newAirline = accounts[3];


    let result = await config.flightSuretyData.isAirlineRegistered.call(registeredAirline);
    assert.equal(result, true, "Airline is not registered");

    let result2 = await config.flightSuretyData.isAirlineRegistered.call(newAirline);
    assert.equal(result2, false, "New airline is registered");

    //let result2 = await config.flightSuretyData.isAirlineFunded.call(registeredAirline);
    //assert.equal(result2, false, "Airline is registered");

    // ACT
    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(newAirline, config.airlines[3].name, {from: registeredAirline});
    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }
    assert.equal(fail, false, "Airline should be able to register another airline if it is registered");

    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline);
    assert.equal(result, true, "Airline is not registered");

    await Util.helper.printAirline(config, newAirline);

    //console.log("getAirline ", result)
  });


  it('(airline) can fund a registered airline', async () => {

    // ARRANGE
    let registeredAirline = accounts[2];

    let result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline);
    assert.equal(result, false, "Airline is funded");

    let fail = false;
    try {

      await config.flightSuretyApp.fundAirline({from: registeredAirline, value: FUNDING_AIRLINE});
    }
    catch(e) {
      console.log("fundAirline error", e)
      fail = true;
    }
    // ASSERT
    assert.equal(fail, false, "Airline should not be able to register another airline if it hasn't provided funding");

    result = await config.flightSuretyData.isAirlineFunded.call(registeredAirline);
    assert.equal(result, true, "Airline is not funded");

    await Util.helper.printAirline(config, registeredAirline);

  });

  it('(airline) newly funded airline can register 1 further airlines (=4 registered airlines in total)', async () => {

    // ARRANGE
    let registeredAirline = accounts[2],
      newAirline4 = accounts[4];

    let result = await config.flightSuretyData.isAirlineRegistered.call(registeredAirline);
    assert.equal(result, true, "Airline is not registered");
    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline4);
    assert.equal(result, false, "Airline is registered");

    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(newAirline4, config.airlines[4].name, {from: registeredAirline});
    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }
    assert.equal(fail, false, "Airlines could not be registered");

    result = await config.flightSuretyData.isAirlineRegistered.call(newAirline4);
    assert.equal(result, true, "Airline is not registered");

  });

  it('(airline) cannot register an Airline without further confirmation for the 5th airline ', async () => {

    let registeredAirline = accounts[4],
      unregisteredAirline = accounts[5];

    let result = await config.flightSuretyData.isAirlineRegistered.call(registeredAirline);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");

    result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");

    let fail = false;

    try {
      await config.flightSuretyApp.registerAirline(unregisteredAirline, config.airlines[5].name,{from: registeredAirline});
    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }
    // ASSERT
    assert.equal(fail, false, "Airline registration should work.");

    result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
  });
  it('(airline) block duplicate register ', async () => {

    let registeredAirline = accounts[4],
      unregisteredAirline = accounts[5];

    let result = await config.flightSuretyData.isAirlineRegistered.call(registeredAirline);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");

    result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");

    let fail = false;

    try {
      await config.flightSuretyApp.registerAirline(unregisteredAirline, config.airlines[5].name,{from: registeredAirline});
    }
    catch(e) {
      //console.log("registerAirline error", e)
      fail = true;
    }
    assert.equal(fail, true, "Airline can be registered");


    result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
  });

  it('(airline) can register an Airline with further confirmation for the 5th airline ', async () => {

    // ARRANGE
    let registeredAirline2 = accounts[2],
      registeredAirline3 = accounts[3],
      registeredAirline4 = accounts[4],
      unregisteredAirline = accounts[5];


    let result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, false, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
    // ACT
    result = await config.flightSuretyData.isAirlineRegistered.call(registeredAirline2);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
    result = await config.flightSuretyData.isAirlineRegistered.call(registeredAirline3);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");
    result = await config.flightSuretyData.isAirlineRegistered.call(registeredAirline4);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");


    let fail = false;
    try {
      await config.flightSuretyApp.registerAirline(unregisteredAirline, config.airlines[5].name,{from: registeredAirline2}); // different than before
      // await config.flightSuretyApp.registerAirline(unregisteredAirline, {from: fundedAirline3});
    }
    catch(e) {
      console.log("registerAirline error", e)
      fail = true;
    }
    assert.equal(fail, false, "Airline cannot be registered");

    // ASSERT
    //assert.equal(fail, true, "Airline should not be able to register another airline if it hasn't provided funding");
    result = await config.flightSuretyData.isAirlineRegistered.call(unregisteredAirline);
    assert.equal(result, true, "Airline used to test if unauthorized airline can register new ones is authorized (added?!)");

  });

  /*
  it('(airline) newly registered airlines can fund themselves (=5 in total)', async () => {

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
*/

});