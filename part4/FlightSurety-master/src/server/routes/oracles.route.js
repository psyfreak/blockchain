const express = require("express"),
    router = express.Router();

// TODO move tagtog routes to own model + route

const ORACLE_REG_FEE = 10;

//TODO normally no get, but for testing purpose
router.get("/register", async (req, res)=> {


  /*
  for(let acc of global.accounts) {
    newOracle = await flightSuretyApp.methods
      .registerOracle()
      .send({from: acc, value: ORACLE_REG_FEE, gas: 2800707 });
    registeredOracles.push(newOracle);
    if(counter == ORACLES_TO_REGISTER) {
      break;
    }
  }
  */



/*

  let newOracle = await flightSuretyApp.methods
    .registerOracle()
    .send({from: global.accounts[0], value: 11, gas: 2800707 });
  registeredOracles.push(newOracle);
*/
  // console.log("result to save", result);
  // TODO clarify this had no effect if consensus: false gets dropped...
  try {
    //register all oracles here
    let registeredOracles = [],
      newOracle = null;
    for (let i = 0, len = global.accounts.length; i < len; i++ ) {
      if(i == ORACLES_TO_REGISTER) {
        break;
      }
      newOracle = await flightSuretyApp.methods
        .registerOracle()
        .send({from: global.accounts[i], value: ORACLE_REG_FEE, gas: 2800707 });
      registeredOracles.push(newOracle);
    }
    res.send({
      message: "Register oracles",
      count: registeredOracles.length,
      data: registeredOracles
    });
  }
  catch(error) {
    return res.status(400).send(error);
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

//TODO add projectId here...
router.get("/", (req, res)=> {
  res.send({message: "jo"});
});

// Register Oracle
router.post("/", async (req, res)=> {
  // console.log("result to save", result);

  // TODO clarify this had no effect if consensus: false gets dropped...
  try {
    let registeredOracles = [],
      newOracle = null;
    for(let i = 0, len = global.accounts.length; i < len; i++ ) {
      if(i == ORACLES_TO_REGISTER) {
        break;
      }
      newOracle = await flightSuretyApp.methods
        .registerOracle()
        .send({from: global.accounts[i], value: ORACLE_REG_FEE, gas: 2800707 });
      registeredOracles.push(newOracle);
    }

    let result = {
      "messages": "Oracles registered",
      "count": registeredOracles.length,
      "data": registeredOracles
    }
    res.send(result);
  }
  catch(error) {
    return res.status(400).send(error);
  }

});

module.exports = router;