const express = require("express"),
    router = express.Router();

// async need extra handling probably babel-polyfill => see https://stackoverflow.com/questions/33527653/babel-6-regeneratorruntime-is-not-defined
router.get('/test', /*async*/ (req, res) => {
/*
  let ret = await global.flightSuretyApp.methods
    .registerAirline()
    .send({ from: self.owner});
    */
  let defAccount = global.web3.eth.defaultAccount

  /*
  global.flightSuretyApp.methods
    .registerAirline()
    .send({from: defAccount }, (error, result) => { //
        console.log("error", error);
      console.log(result)
      });
   */
  global.flightSuretyApp.methods
    .registerAirline()
    .send({from: defAccount }).then(function(result){
    console.log(result)
  });

  res.send({
    message: 'An API for use with your Dapp!' + global.config + " " + defAccount
  })
})

router.get('/test2', /*async*/ (req, res) => {
  /*
    let ret = await global.flightSuretyApp.methods
      .registerAirline()
      .send({ from: self.owner});
      */
  let defAccount = global.web3.eth.defaultAccount

  global.flightSuretyApp.methods
    .registerAirline()
    .call({from: defAccount }).then(function(result){
    console.log(result)
  })

  res.send({
    message: 'An API for use with your Dapp!' + global.test + " " + defAccount
  })
})

router.get('/buy', async (req, res) => {

  let flight = 'ND1309', // Course number
    timestamp = Math.floor(Date.now() / 1000);

  let purchased = await flightSuretyApp.methods
    .buy(global.accounts[0], flight, timestamp)
    .send({from: global.accounts[0], value: 160, gas: 2800707 });


  res.send({
    message: JSON.stringify(purchased)
  })
})

module.exports = router;