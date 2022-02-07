const express = require("express"),
    router = express.Router();

// TODO move tagtog routes to own model + route


router.get("/status", async (req, res)=> {
  console.log("jo")
  try {

    let regFee = await flightSuretyApp.methods.ORACLE_REGISTRATION_FEE().call({from: global.accounts[0] });
    console.log(regFee)
/*
    let minResponses = await flightSuretyApp.methods.MIN_RESPONSES().call({from: global.accounts[0] });
    console.log(minResponses)
*/
    let oracleCount = await flightSuretyApp.methods.oracleCount().call({from: global.accounts[0] });
    console.log(oracleCount)
    res.send(
      {
        message: "Request indices of oracle (only for development purpose - these indices should never go public)",
        requestedAccountId: global.accounts[0],
        data: {
          count: oracleCount,
          //minResponses,
          regFee: regFee
        }
      });
  }
  catch(error) {
    // TODO devMode/debugMode appreciated...
    // react on duplicate => {"driver":true,"name":"MongoError","index":0,"code":11000,"errmsg":"E11000 duplicate key error collection: fcch.results index: user_1_result_1_source_1 dup key: { : { id: ObjectId('5e4a7e2291023e2af4e44625'), name: \"bill4\" }, : { fcc: \"aluminum\", fca: \"packaging\", fcm_main: \"PET\", fcm_focus: \"Adhesive\", experiment: \"Migration into Food\", detected: \"yes\" }, : { id: ObjectId('5e70eb8f3c2a222be0defadd'), articleId: 218, title: \"Mineral elements in canned Spanish liver pat�\" } }"}
    return res.status(400).send(error);
    //return res.status(400).send("Save result failed.");
  }

});


router.get("/:accountIndex",  async(req, res)=> {
  const accIndex = req.params['accountIndex'];
  const oracleAddress = global.accounts[accIndex];

  try {
    let indexes = await flightSuretyApp.methods.getMyIndexes().call({from: oracleAddress });
    res.send(
      {
        message: "Request indices of oracle (only for development purpose - these indices should never go public)",
        requestedAccountId: accIndex,
        requestedAddress: oracleAddress,
        data: indexes
    });
  }
  catch(error) {
    // TODO devMode/debugMode appreciated...
    // react on duplicate => {"driver":true,"name":"MongoError","index":0,"code":11000,"errmsg":"E11000 duplicate key error collection: fcch.results index: user_1_result_1_source_1 dup key: { : { id: ObjectId('5e4a7e2291023e2af4e44625'), name: \"bill4\" }, : { fcc: \"aluminum\", fca: \"packaging\", fcm_main: \"PET\", fcm_focus: \"Adhesive\", experiment: \"Migration into Food\", detected: \"yes\" }, : { id: ObjectId('5e70eb8f3c2a222be0defadd'), articleId: 218, title: \"Mineral elements in canned Spanish liver pat�\" } }"}
    return res.status(400).send(error);
    //return res.status(400).send("Save result failed.");
  }
});

// register specific oracle
router.post("/register/:oracleId", async (req, res)=> {
  // not implemented yet
  /*

    let newOracle = await flightSuretyApp.methods
      .registerOracle()
      .send({from: global.accounts[0], value: 11, gas: 2800707 });
    registeredOracles.push(newOracle);
  */
});
// Register Oracle
router.post("/:countOracles", async (req, res)=> {
  // console.log("result to save", result);
  let numOfOraclesToRegister = req.params['countOracles'];
  if(numOfOraclesToRegister <= 0 || Number.isNaN(numOfOraclesToRegister)) {
    numOfOraclesToRegister = config.oracles.count
  }
  // TODO clarify this had no effect if consensus: false gets dropped...
  try {
    let registeredOracles = [],
      newOracle = null;

    let beforeOracleCount = await flightSuretyApp.methods
      .oracleCount()
      .call({from: global.accounts[0]});

    beforeOracleCount = parseInt(beforeOracleCount);

    console.log("beforeOracleCount", beforeOracleCount)

    for(let i = 0, len = global.accounts.length; i < len; i++ ) {
      if(i == numOfOraclesToRegister) {
        break;
      }

      let registrationOracleFee = web3.utils.toWei(config.fees.registrationOracle, 'ether');
      newOracle = await flightSuretyApp.methods
        .registerOracle()
        .send({from: global.accounts[i + beforeOracleCount], value: registrationOracleFee, gas: 2800707 });
      registeredOracles.push(newOracle);

      registeredOracles.push(newOracle);
    }
    console.log("afterregisterOracle", newOracle)
    let afterOracleCount = await flightSuretyApp.methods
      .oracleCount()
      .call({from: global.accounts[0]});

    afterOracleCount = parseInt(afterOracleCount);
    console.log("afterOracleCount", afterOracleCount)

    let result = {
      "messages": "Oracles registered",
      "countbefore": beforeOracleCount,
      "count": afterOracleCount,
      "data": registeredOracles
    }
    res.send(result);
  }
  catch(error) {
    return res.status(400).send(error);
  }
/*
  let error = null;
  // console.log("result to save", result);
  // TODO clarify this had no effect if consensus: false gets dropped...
  try {
    //register all oracles here
    let registeredOracles = [],
      newOracle = null;
    for (let i = 0, len = global.accounts.length; i < len; i++ ) {
      if(i == config.oracles.count) {
        break;
      }
      newOracle = await flightSuretyApp.methods
        .registerOracle()
        .send({from: global.accounts[i], value: config.fees.registrationOracle, gas: 2800707 });
      registeredOracles.push(newOracle);
    }
     res.send({
      message: "Register oracles",
      count: registeredOracles.length,
      data: registeredOracles
    });
  }
  catch(err) {
    error=err;
  }
  if(error) {
    return res.status(400).send(error);
  }
 */
});

module.exports = router;