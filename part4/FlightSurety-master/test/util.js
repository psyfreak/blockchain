const util = {
  printBaseInfo: async function(config) {
    console.log("\t\tWeb3 version: " + web3.version);
    const  FLIGHT_NAME = config.flights[0].name;
    const FLIGHT_timestamp = config.flights[0].departure;
    console.log("\t\tfirstAirline", config.firstAirline, "Test flight", FLIGHT_NAME, " departure", FLIGHT_timestamp);
    console.log("\t\tconfig.flightSuretyApp adr: ", config.flightSuretyApp.address);
    console.log("\t\tconfig.flightSuretyData adr: ", config.flightSuretyData.address);
  },
  printAmounts: async function(config, prefix) {
    let total = await config.flightSuretyData.numOfAirlines.call();
    let registered = await config.flightSuretyData.numOfRegisteredAirlines.call();
    let funded = await config.flightSuretyData.numOfFundedAirlines.call();
    console.log(`\t\t${prefix} Airlines (total/registered/funded): ${total.toString()} / ${registered.toString()} / ${funded.toString()} `)
  },
  printBalance: async function(config, prefix, acc) {
    let balanceApp = await web3.eth.getBalance(config.flightSuretyApp.address);
    let balanceData = await web3.eth.getBalance(config.flightSuretyData.address);
    let balanceAcc = 0;

    if (acc) {
      balanceAcc = await web3.eth.getBalance(acc);
    }
    console.log(`\t\t${prefix} Balances (App/Data/acc): ${balanceApp.toString()} / ${balanceData.toString()} / ${balanceAcc.toString()} `)
  },
  /**
   * Print passanger´s current insurance for a flight + payout
   * @param config
   * @returns {Promise<void>}
   */
  printPassenger: async function(config, passengerAddress) {
    let payout = await config.flightSuretyData.balances.call(passengerAddress);
    console.log(`\t\tPassenger (payout/): ${payout.toString()} / `)
  },
  printAirline: async function(config, airlineAddress) {
    let result = await config.flightSuretyData.getAirlineByAddress.call(airlineAddress);
    console.log(`\t\tAirlines (id/isRegistered/registeredBy/investment/timestamp): ${result['0'].toString()} / ${result['1'].toString()} / ${result['2'].toString()} / ${result['3'].toString()} / ${new Date(result['4'].toString()*1000)} `)
  },
  printAllAirlines: async function(config, accounts) {
    for(let acc of accounts) {
      await util.printAirline(config, acc);
    }
  },
  printFlight: async function(config, airlineAddress, flightName, departure) {
    let result = await config.flightSuretyData.getFlight.call(airlineAddress, flightName, departure);
    console.log(`\t\tFlight (id/isRegistered/registeredBy/status/passengers): ${result['0'].toString()} / ${result['1'].toString()} / ${result['3'].toString()} / ${result['2'].toString()} / ${result['4']} `)
  },
  printAllFlights: async function(config) {


    for(let acc of accounts) {

      let result = await config.flightSuretyData.getFlight.call(accounts[9], FLIGHT_NAME, FLIGHT_timestamp);
      console.log("allAirlines", result);
      //console.log(`\t\tAirlines (id/isRegistered/registeredBy/investment/timestamp): ${result['0'].toString()} / ${result['1'].toString()} / ${result['2'].toString()} / ${result['3'].toString()} / ${new Date(result['4'].toString()*1000)} `)

    }
  },
  printAllPassengers: async function(config) {
    const  FLIGHT_NAME = config.flights[0].name;
    const FLIGHT_timestamp = config.flights[0].departure;

    for(let acc of accounts) {

      let result = await config.flightSuretyData.getFlight.call(accounts[9], FLIGHT_NAME, FLIGHT_timestamp);
      console.log("allAirlines", result);
      //console.log(`\t\tAirlines (id/isRegistered/registeredBy/investment/timestamp): ${result['0'].toString()} / ${result['1'].toString()} / ${result['2'].toString()} / ${result['3'].toString()} / ${new Date(result['4'].toString()*1000)} `)
    }
  },
  // TODO add passenger info
  // TODO add logger for reason only / exceptions
}

module.exports = {
  helper: util
};