const express = require("express"),
    router = express.Router();

// TODO move tagtog routes to own model + route

//TODO normally no get, but for testing purpose
router.get("/register", async (req, res)=> {
  let result = [];
  console.log("register airline")
  let newOracle = await flightSuretyApp.methods
    .registerAirline(global.accounts[2])
    .send({from: global.accounts[0], value: 0, gas: 2800707 });

  result.push(newOracle);
  try {
    res.send(result);
  }
  catch(error) {
    return res.status(400).send(error);
  }
});

router.get("/:airlineAddress",(req, res)=> {

});

//TODO add projectId here...
router.get("/", (req, res)=> {

});

// TODO not implemented yet
router.post("/", (req, res)=> {

});


module.exports = router;