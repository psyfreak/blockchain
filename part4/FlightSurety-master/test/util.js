const util = {
  printAmounts: async function(config) {
    let total = await config.flightSuretyData.numOfAirlines.call();
    let registered = await config.flightSuretyData.numOfRegisteredAirlines.call();
    let funded = await config.flightSuretyData.numOfFundedAirlines.call();
    console.log(`Airlines (total/registered/funded): ${total.toString()} / ${registered.toString()} / ${funded.toString()} `)
  },
  printBalance: async function(config, acc) {
    let balanceApp = await web3.eth.getBalance(config.flightSuretyApp.address);
    let balanceData = await web3.eth.getBalance(config.flightSuretyData.address);
    let balanceAcc = 0;

    if (acc) {
      balanceAcc = await web3.eth.getBalance(acc);
    }
    console.log(`Balances (App/Data/acc): ${balanceApp.toString()} / ${balanceData.toString()} / ${balanceAcc.toString()} `)
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

module.exports = {
  helper: util
};