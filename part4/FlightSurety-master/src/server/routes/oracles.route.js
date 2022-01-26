const express = require("express"),
    router = express.Router();

// TODO move tagtog routes to own model + route


//TODO normally no get, but for testing purpose
router.get("/register", async (req, res)=> {
  let result = [];
  console.log("jo")
  //register all oracles here
  /*
  for(let acc of global.accounts) {
    let newOracle = await global.flightSuretyApp.methods
    .registerOracle()
    .send({from: acc, value: 1, gas: 2800707 });
    result.push(newOracle);
  }

   */



  let newOracle = await flightSuretyApp.methods
    .registerOracle()
    .send({from: global.accounts[0], value: 11, gas: 2800707 });
  result.push(newOracle);



  //console.log("metaObj", metaObj);
  //if (!metaId) return res.status(400).send("metaId does not exist.");



  // console.log("result to save", result);
  // TODO clarify this had no effect if consensus: false gets dropped...
  try {
    res.send(result);
  }
  catch(error) {
    // TODO devMode/debugMode appreciated...
    // react on duplicate => {"driver":true,"name":"MongoError","index":0,"code":11000,"errmsg":"E11000 duplicate key error collection: fcch.results index: user_1_result_1_source_1 dup key: { : { id: ObjectId('5e4a7e2291023e2af4e44625'), name: \"bill4\" }, : { fcc: \"aluminum\", fca: \"packaging\", fcm_main: \"PET\", fcm_focus: \"Adhesive\", experiment: \"Migration into Food\", detected: \"yes\" }, : { id: ObjectId('5e70eb8f3c2a222be0defadd'), articleId: 218, title: \"Mineral elements in canned Spanish liver pat�\" } }"}
    return res.status(400).send(error);
    //return res.status(400).send("Save result failed.");
  }
});

router.get("/:sourceId",  (req, res)=> {

});

//TODO add projectId here...
router.get("/", (req, res)=> {

});



// TODO not implemented yet
router.post("/", async (req, res)=> {

  // console.log("result to save", result);
  // TODO clarify this had no effect if consensus: false gets dropped...
  try {
    res.send(result);
  }
  catch(error) {
    // TODO devMode/debugMode appreciated...
    // react on duplicate => {"driver":true,"name":"MongoError","index":0,"code":11000,"errmsg":"E11000 duplicate key error collection: fcch.results index: user_1_result_1_source_1 dup key: { : { id: ObjectId('5e4a7e2291023e2af4e44625'), name: \"bill4\" }, : { fcc: \"aluminum\", fca: \"packaging\", fcm_main: \"PET\", fcm_focus: \"Adhesive\", experiment: \"Migration into Food\", detected: \"yes\" }, : { id: ObjectId('5e70eb8f3c2a222be0defadd'), articleId: 218, title: \"Mineral elements in canned Spanish liver pat�\" } }"}
    return res.status(400).send(error);
    //return res.status(400).send("Save result failed.");
  }
});
//router.post("/addRating/:sourceId", auth, source_controller.source_create_rating);

module.exports = router;