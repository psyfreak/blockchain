/**
 * Test zokrates and verification in an isolated way without the other systems.
 */
// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var Verifier = artifacts.require('Verifier');
const fs = require('fs'),
  path = require('path'),
  { initialize } = require('zokrates-js/node');

contract('Verifier', async (accounts) => {
  //let verifier = await Verifier.deployed();

  const account_one = accounts[0];
  const account_two = accounts[1];
  //this.contract = await Verifier.new({from: account_one});
  let instance ;

  //const balance = await instance.getBalance.call(accounts[0]);

  let proofs = [],
    incorrectProof = {};


  before('setup contract', async () => {
    console. log("Current directory:", __dirname);
    let path1 = path.join(__dirname, "../../zokrates/res/proofs.json");
    let rawdata = fs.readFileSync(path1);
    instance = await Verifier.deployed();
    //let rawdata = fs.readFileSync(__dirname+ '..\..\proofs.json');
    proofs = JSON.parse(rawdata);
    //console.log(proofs);
    path1 = path.join(__dirname, "../../zokrates/res/false-proof.json");
    rawdata = fs.readFileSync(path1);
    incorrectProof = JSON.parse(rawdata);
    //console.log(incorrectProof);

  });

  // Test verification with correct proof
  // - use the contents from proof.json generated from zokrates steps
  it('Verifier checks on chain with correct proofs', async () => {
    //console.log("proofs[0].proof", proofs[0].proof)
    //console.log("proofs[0].inputs", proofs[0].inputs)
    let result = await instance.verifyTx.call(proofs[0].proof, proofs[0].inputs, { from: account_one });
    assert.equal(result, true, "Proof is invalid, but it should not");
    //console.log("result correctProof", result)
  });

  // Test verification with incorrect proof
  it('Verifier checks on chain with incorrect proof (changed inputs)', async () => {
    //  fiddle with the actual generated proof (eg. by changing something in the proof.json)
    //console.log("proofs[0].proof", incorrectProof.proof)
    //console.log("proofs[0].inputs", incorrectProof.inputs)
    let result = await instance.verifyTx.call(incorrectProof.proof, incorrectProof.inputs, { from: account_one });
    assert.equal(result, false, "Proof is valid, but it should not");
    //console.log("result incorrectProof", result)
  });

});







    

