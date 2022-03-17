let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const fs = require('fs'),
  path = require('path');

contract('SolnSquareVerifier', async (accounts) => {

  const account_one = accounts[0];
  const account_two = accounts[1];
  const tokens = [1,2,3];

  let proofs = [],
    incorrectProof = {},
    instance;

  before('setup contract', async () => {
    console. log("Current directory:", __dirname);
    let path1 = path.join(__dirname, "../../zokrates/res/proofs.json");
    let rawdata = fs.readFileSync(path1);
    instance = await SolnSquareVerifier.deployed();
    //let rawdata = fs.readFileSync(__dirname+ '..\..\proofs.json');
    proofs = JSON.parse(rawdata);
    //console.log(proofs);
    path1 = path.join(__dirname, "../../zokrates/res/false-proof.json");
    rawdata = fs.readFileSync(path1);
    incorrectProof = JSON.parse(rawdata);
    //console.log(incorrectProof);

    //this.contract = await SolnSquareVerifier.new({from: account_one});

  });

  describe('check base function', function () {
    beforeEach(async function () {

    })
    it('a solution cannot be found', async function () {
      //let result = await config.flightSuretyData.isAirlineFunded.call(config.firstAirline);
      let hashSolution = await instance.genHashForZokratesArguments(proofs[1].proof, proofs[1].inputs, {from: account_one});
      let result = await instance.isSolutionRegistered.call(hashSolution);
      assert.equal(result, false, "Solution can be found");
    })

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('new solution can be added', async function () {
      //let result = await config.flightSuretyData.isAirlineFunded.call(config.firstAirline);
      let hashSolution = await instance.genHashForZokratesArguments(proofs[0].proof, proofs[0].inputs, {from: account_one});
      console.log("\thashSolution:", hashSolution);
      let result = await instance.addSolution(hashSolution, {from: account_one});
      //assert.equal(supply, tokens.length, "Supply does not match to current minted tokens");
      let solution = await instance.getSolutionByKey.call(hashSolution);
      console.log("\tsolution:", solution);
      result = await instance.isSolutionRegistered.call(hashSolution);
      assert.equal(result, true, "Solution cannot be found");
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('Mint Token with proof', async function () {
      let balance = await instance.balanceOf.call(account_one);
      assert.equal(balance, 0, "Token balance does not match");
      //let solution = await instance.mintToken(proofs[1].proof, proofs[1].inputs, account_one, 1, {from: account_one});
      let solution = await instance.mintToken(proofs[1].proof, proofs[1].inputs, account_one, {from: account_one});
      let hashSolution = await instance.genHashForZokratesArguments(proofs[1].proof, proofs[1].inputs, {from: account_one});
      let result = await instance.isSolutionRegistered.call(hashSolution);
      assert.equal(result, true, "Solution cannot be found");

      balance = await instance.balanceOf.call(account_one);
      assert.equal(balance, 1, "Token balance does not match");
    })
    it('should fail when minting a solution again', async function () {
      let fail = false;
      // ACT
      try {
        let solution = await instance.mintToken(proofs[1].proof, proofs[1].inputs, account_one, {from: account_one});
      }
      catch(e) {
        fail= true;
        console.log("\t\terror mintToken", e.message)
        //console.log("first flight fail, which should not be the case", e)
      }
      // ASSERT
      assert.equal(fail, true, "Token could be minted thoug solution exists");
    })
  });
})
