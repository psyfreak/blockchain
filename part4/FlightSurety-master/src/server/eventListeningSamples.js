//working
flightSuretyData.events.PassengerRegistered({
  fromBlock: "latest" //"latest" //0
})
  .on('data', event => console.log(event))/*
  .on('changed', changed => console.log(changed))
  .on('error', err => throw err)
  .on('connected', str => console.log(str))
  */



// event triggered by UI. Button push causes request to be generated for the oracles to fetchData for a specific flight.
// => fetchFlightStatus
// this also returns old events from the log - TODO verify if this is due to option below: fromBlock: 0
/*
flightSuretyApp.events.OracleRequest({
  filter: {
    //myIndexedParam: [20,23],
    //myOtherIndexedParam: '0x123456789...'
  }, // Using an array means OR: e.g. 20 or 23
  fromBlock: 0
}, function(error, event){ console.log(event); })
  .on("connected", function(subscriptionId){
    console.log(subscriptionId);
  })
  .on('data', function(event){
    console.log(event); // same results as the optional callback above
  })
  .on('changed', function(event){
    console.log(event); // same results as the optional callback above
  })
  .on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
    console.log(receipt); // same results as the optional callback above
  });
*/


/*
flightSuretyApp.events.OracleRegistered({
  fromBlock: 0
}, function (error, event) {
  if (error) console.log(error)
  console.log(event)

  // register
  // iterate over all registered oracles and

  // submit
  //flightSuretyApp.submitOracleResponse()
});
*/

/*
flightSuretyApp.getPastEvents({
  fromBlock: 0
}, function (error, event) {
  if (error) console.log(error)
  console.log(event)

  // register
  // iterate over all registered oracles and

  // submit
  //flightSuretyApp.submitOracleResponse()
});
*/