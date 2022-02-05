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
// could also add these globals to the request object
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

const statusCodeArray = [
  config.oracles.statusCodes.STATUS_CODE_UNKNOWN, // default set
  config.oracles.statusCodes.STATUS_CODE_ON_TIME,
  config.oracles.statusCodes.STATUS_CODE_LATE_AIRLINE,
  config.oracles.statusCodes.STATUS_CODE_LATE_WEATHER,
  config.oracles.statusCodes.STATUS_CODE_LATE_TECHNICAL,
  config.oracles.statusCodes.STATUS_CODE_LATE_OTHER
];
//
let oracleRegisteredSub = flightSuretyApp.events.OracleRegistered({
  fromBlock: "latest" //"latest" //0
})
  .on('data', event => console.log(event))/*
  .on('changed', changed => console.log(changed))
  .on('error', err => throw err)
  .on('connected', str => console.log(str))
  */
//
flightSuretyApp.events.OracleRequest({
  fromBlock: "latest" //"latest" //0
}, async function (error, event) {
  if (error) {
    console.log("error",error)
  }
  console.log("event OracleRequest", event)

  // hack Result prototype / no pure json
  let parsedJson = transformEventReturnToJson(event.returnValues);

  let oracleResponses = [],
    newOracleResponse = null;
  let request = {
    index: parsedJson.index,
    airline: parsedJson.airline,
    name: parsedJson.flight,
    timestamp: parsedJson.timestamp,
    //status: config.oracles.statusCodes.STATUS_CODE_LATE_AIRLINE // for development to test postprocessing and insurance repay
    status: config.oracles.randomPerOracle?config.oracles.statusCodes.STATUS_CODE_UNKNOWN:statusCodeArray[getRandomInt(1,statusCodeArray.length - 1)] //
  };
  console.log("request", request, "config.oracles.randomPerOracle", config.oracles.randomPerOracle);
/*
  let flight = await flightSuretyApp.methods.getFlight(request.airline, request.name, request.timestamp).call({from:  global.accounts[0] });
  console.log("flight", flight);
*/
  // iterate over all registered oracles and
  console.log("oracles (currentCount)", config.oracles.count);
  let statusCode = request.status;

  for (let i = 0, len = global.accounts.length; i < len; i++ ) {
    if (i == config.oracles.count) {
      break;
    }
    try {
      if(config.oracles.randomPerOracle) {
        statusCode = statusCodeArray[getRandomInt(1,statusCodeArray.length - 1)]
        console.log(`#oracle: ${i} submits statusCode: ${statusCode}`);
      }
      //console.log("submitOracleResponse: #oracle: " + i + " index = " + request.index + " airline = " + request.airline + " name = " + request.name + " timestamp = " + request.timestamp);
      newOracleResponse = await flightSuretyApp.methods
        .submitOracleResponse(request.index, request.airline, request.name, request.timestamp, statusCode)
        .send({from: global.accounts[i], gas: 2800707 });
      // console.log("newOracleResponse", newOracleResponse)
    } catch(e) {
      console.log("error submitOracleResponse:" + e.message +" #oracle: " + i + " index = " + request.index + " airline = " + request.airline + " name = " + request.name + " timestamp = " + request.timestamp);
      continue;
    }
    oracleResponses.push(newOracleResponse);
  }
  console.log("newOracleResponses", oracleResponses.length, oracleResponses);

});

/**
 * Return random int between min and max (both inclusive)
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Transform event return Value to json.
 * @param eventReturnValues
 * @returns {any}
 */
function transformEventReturnToJson(eventReturnValues) {
  console.log("transformEventReturnToJson", eventReturnValues);
  let retString = JSON.stringify(eventReturnValues);
  let parsesd = retString.replace("Result ", "");
  let parsedJson = JSON.parse(parsesd);
  return parsedJson;
}


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


