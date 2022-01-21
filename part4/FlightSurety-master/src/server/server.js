import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
//import {flight, timestamp} from "./oracles";//ljj
const morgan = require("morgan");

let config = Config['localhost'];
// we could also add these globals to the request object
global.test = "jo";
global.web3 = new Web3(new Web3.providers.WebsocketProvider(config.url.replace('http', 'ws')));
web3.eth.defaultAccount = web3.eth.accounts[0];


web3.eth.getAccounts().then(accounts => {
  web3.eth.defaultAccount = accounts[0];
  global.accounts = accounts;
  console.log("web3.eth.accounts[0]", global.accounts)
  console.log("web3.eth.defaultAccount", global.web3.eth.defaultAccount);
/*
  //register all oracles here
  flightSuretyApp.methods
    .registerOracle()
    .send({from: global.accounts[0], value: 1, gas: 2800707 }).then(function(result){
    console.log(result)
  });
 */
})


global.flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);




// event triggered by UI. Button push causes request to be generated for the oracles to fetchData for a specific flight.
// => fetchFlightStatus
// this also returns old events from the log - TODO verify if this is due to option below: fromBlock: 0
flightSuretyApp.events.OracleRequest({
    fromBlock: 0
  }, function (error, event) {
    if (error) console.log(error)
    console.log(event)

    // iterate over all registered oracles and

    // submit
    //flightSuretyApp.submitOracleResponse()
});

flightSuretyApp.events.OracleRegistered({
  fromBlock: 0
}, function (error, event) {
  if (error) console.log(error)
  console.log(event)

  // iterate over all registered oracles and

  // submit
  //flightSuretyApp.submitOracleResponse()
});


// server should register oracles maybe in initialization phase + payment
// add testAccount to config, so that we can use this config



const app = express();
app.use(morgan("dev"));
app.use("/api/tests", require("./routes/tests.route"));
app.use("/api/oracles", require("./routes/oracles.route"));
app.use("/api/flights", require("./routes/flights.route"));
app.use("/api/airlines", require("./routes/airlines.route"));


export default app;


