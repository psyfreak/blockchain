import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import FlightSuretyData from '../../build/contracts/FlightSuretyData.json'; // for dev purpose
import Config from './config.json';
import Web3 from 'web3';
import express from 'express';
const cors = require('cors')
//import {flight, timestamp} from "./oracles";//ljj
const morgan = require("morgan");

console.log("\t\tWeb3 version: " + Web3.version);

let configLocalhost = Config['localhost'];
// we could also add these globals to the request object
global.test = "jo";
global.config = Config;
global.web3 = new Web3(new Web3.providers.WebsocketProvider(configLocalhost.url.replace('http', 'ws')));
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
});
console.log(global.Config)

global.flightSuretyApp = new web3.eth.Contract(FlightSuretyApp.abi, configLocalhost.appAddress);
global.flightSuretyData = new web3.eth.Contract(FlightSuretyData.abi, configLocalhost.dataAddress);
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const statusCodeArray = [
  config.statusCodes.STATUS_CODE_UNKNOWN,
  config.statusCodes.STATUS_CODE_ON_TIME,
  config.statusCodes.STATUS_CODE_LATE_AIRLINE,
  config.statusCodes.STATUS_CODE_LATE_WEATHER,
  config.statusCodes.STATUS_CODE_LATE_TECHNICAL,
  config.statusCodes.STATUS_CODE_LATE_OTHER
];

flightSuretyApp.events.OracleRequest({
  fromBlock: 0
}, async function (error, event) {
  if (error) console.log(error)
  console.log("event", event)
  //console.log("event.returnValues", event.returnValues)
  let retString = JSON.stringify(event.returnValues);
  //console.log("retString", retString)
  let parsesd = retString.replace("Result ", "");
  let parsedJson = JSON.parse(parsesd);

  let oracleResponses = [],
    newOracleResponse = null,
    counter = 0;
  let request = {
    index: parsedJson.index,
    airline: parsedJson.airline,
    name: parsedJson.flight,
    timestamp: parsedJson.timestamp,
    status: statusCodeArray[getRandomInt(0,statusCodeArray.length - 1)]//config. // TODO ADD randomization
  };
  console.log("request", request);
/*
  let flight = await flightSuretyApp.methods.getFlight(request.airline, request.name, request.timestamp).call({from:  global.accounts[0] });
  console.log("flight", flight);
*/
  // iterate over all registered oracles and
  for (let i = 0, len = global.accounts.length; i < len; i++ ) {
    if(i == 5) {
      break;
    }
    try {
      newOracleResponse = await flightSuretyApp.methods
        .submitOracleResponse(request.index, request.airline, request.name, request.timestamp, request.status)
        .send({from: global.accounts[i], gas: 2800707 });
      console.log("newOracleResponse", newOracleResponse)

    } catch(e) {
      console.log(e.message + " " + request.airline + " " + request.name + " " + request.timestamp);
      continue;
    }
    oracleResponses.push(newOracleResponse);
  }
  console.log("newOracleResponses", oracleResponses.length, oracleResponses);

});


const app = express();
app.set('json spaces', 2);
app.use(cors());
/*
app.use((req, res, next) => {

  //res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  next();
});
*/
app.use(morgan("dev"));
app.use("/api/tests", require("./routes/tests.route"));
app.use("/api/oracles", require("./routes/oracles.route"));
app.use("/api/flights", require("./routes/flights.route"));
app.use("/api/airlines", require("./routes/airlines.route"));


export default app;


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