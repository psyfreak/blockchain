const express = require("express"),
    router = express.Router();

// TODO move tagtog routes to own model + route

router.get("/:airlineAddress",(req, res)=> {

});

//TODO add projectId here...
router.get("/", (req, res)=> {

});

// TODO not implemented yet
router.post("/", (req, res)=> {

});
router.post("/addRating/:sourceId", (req, res)=> {

});

module.exports = router;