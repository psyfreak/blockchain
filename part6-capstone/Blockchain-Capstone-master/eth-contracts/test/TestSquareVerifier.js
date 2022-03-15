/**
 * Test zokrates and verification in an isolated way without the other systems.
 */
// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
var Verifier = artifacts.require('Verifier');

contract('Verifier', accounts => {

  const account_one = accounts[0];
  const account_two = accounts[1];

  describe('Verifier checks', function () {
    beforeEach(async function () {
      // compute witness +

      // TODO: mint multiple tokens
    })
    // Test verification with correct proof
    // - use the contents from proof.json generated from zokrates steps
    it('should return total supply', async function () {
      const accounts = await web3.eth.getAccounts();
      const address = '0x456...'; // verifier contract address

      let verifier = new web3.eth.Contract(abi, address, {
        from: accounts[0], // default from address
        gasPrice: '20000000000000'; // default gas price in wei
      });

      let result = await verifier.methods
        .verifyTx(proof.proof, proof.inputs)
        .call({ from: account_one });
    })

    // Test verification with incorrect proof
    it('Test verification with incorrect proof', async function () {
      //  fiddle with the actual generated proof (eg. by changing something in the proof.json)

    })
  });
});







    

