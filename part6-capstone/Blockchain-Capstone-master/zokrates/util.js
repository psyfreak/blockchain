const { initialize } = require('zokrates-js/node');
const fs = require('fs');

// generate 10 proofs and save them to


const util = {
  test: async function() {
    initialize().then((zokratesProvider) => {

      //const source = "def main(private field a) -> field: return a * a";
      const source = "def main(private field a, field b) -> field: field result = if a * a == b then 1 else 0 fi\nreturn result";
      // TODO read file instead
      const options = {
        location: "main.zok", // location of the root module
        resolveCallback: (currentLocation, importLocation) => {
          console.log(currentLocation + ' is importing ' + importLocation);
          return {
            source: "def main() -> (): return",
            location: importLocation
          };
        }
      };

      // compilation
      const artifacts = zokratesProvider.compile(source);

      // run setup
      const keypair = zokratesProvider.setup(artifacts.program);
      // computation | generate 10 witnesses/proofs
      const { witness, output } = zokratesProvider.computeWitness(artifacts, ["2", "4"]);
      console.log("output", output)

      // generate proof
      const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);
      console.log("proof", proof);
      // fiddle arround with the proof
      //console.log("proof.proof before\t", proof.proof.c[0])
      proof.proof.c[0] = proof.proof.c[0].replace("8", "9");
      //console.log("proof.proof after\t", proof.proof.c[0]);
      /*
      // export solidity verifier
      const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v1");
      //console.log("verifier", verifier)
      fs.writeFile('../eth-contracts/contracts/Verifier.sol', verifier, function (err) {
        if (err) return console.log(err);
        console.log('Verifier contract written');
      });
      */
      const verify = zokratesProvider.verify(keypair.vk, proof);
      console.log("verify", verify)

    });

  },
  generateProofs: async function() {
    initialize().then((zokratesProvider) => {

      //const source = "def main(private field a) -> field: return a * a";
      const source = "def main(private field a, field b) -> field: field result = if a * a == b then 1 else 0 fi\nreturn result";
      // compilation
      const artifacts = zokratesProvider.compile(source);


      // run setup
      const keypair = zokratesProvider.setup(artifacts.program);


      // export solidity verifier
      const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v1");
      //console.log("verifier", verifier)
      fs.writeFile('../eth-contracts/contracts/Verifier.sol', verifier, function (err) {
        if (err) return console.log(err);
        console.log('Verifier contract written');
      });

      // computation
      const NUM_ELEMENTS = 10;
      let inputArray = [],
        elemArray = [];
      for(let i = 1; i <= NUM_ELEMENTS; i++) {
        elemArray = [];
        // zokrates only takes strings as params
        elemArray.push(i.toString(10));
        elemArray.push((i*i).toString(10));
        inputArray.push(elemArray);
      }
      let proofArray = [];
      console.log("inputArray", inputArray.length, inputArray);

      //////////////// generate json for NUM_ELEMENTS proofs
      for(let elem of inputArray) {
        //console.log("elem", elem)
        const { witness, output } = zokratesProvider.computeWitness(artifacts, elem);
        //console.log("output", output)
        // generate proof
        const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);
        const verify = zokratesProvider.verify(keypair.vk, proof);
        console.log("verify proof with input", elem, verify)
        proofArray.push(proof);
      }
      let data = JSON.stringify(proofArray, null, 2);
      // check proofs
      fs.writeFile('./res/proofs.json', data, function (err) {
        if (err) return console.log(err);
        console.log('proofArray written');
      });


      //////////////// generate incorrect proof
      let falseProof = proofArray[0];

      // fiddle around with the proof / arbitrary change just replace a number with another
      //console.log("proof.proof before\t", falseProof.proof.c[0])
      // on web3 with ganache this leads to an invalid opcode error
      //falseProof.proof.c[0] = falseProof.proof.c[0].replace("8", "9");
      // while changing input results in a false value
      falseProof.inputs[1] = falseProof.inputs[1].replace("1", "7");
      //console.log("proof.proof after\t", falseProof.proof.c[0]);

      // check proof is incorrect
      const verify = zokratesProvider.verify(keypair.vk, falseProof);
      console.log("verify proof with input", falseProof, verify)

      data = JSON.stringify(falseProof, null, 2);
      fs.writeFile('./res/false-proof.json', data, function (err) {
        if (err) return console.log(err);
        console.log('false proof written');
      });

    });
  }
}

util.generateProofs().then(()=>{

})

module.exports = {
  helper: util
};
