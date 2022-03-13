const { initialize } = require('zokrates-js/node');
const fs = require('fs');

initialize().then((zokratesProvider) => {

  //const source = "def main(private field a) -> field: return a * a";
  const source = "def main(private field a, field b) -> field: field result = if a * a == b then 1 else 0 fi\nreturn result";

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

  // computation
  const { witness, output } = zokratesProvider.computeWitness(artifacts, ["2", "4"]);

  console.log("output", output)

  // run setup
  const keypair = zokratesProvider.setup(artifacts.program);

  // generate proof
  const proof = zokratesProvider.generateProof(artifacts.program, witness, keypair.pk);

  // generate 10 witnesses/proofs

  // export solidity verifier
  const verifier = zokratesProvider.exportSolidityVerifier(keypair.vk, "v1");
  //console.log("verifier", verifier)
  fs.writeFile('../eth-contracts/contracts/Verifier.sol', verifier, function (err) {
    if (err) return console.log(err);
    console.log('Verifier contract written');
  });
  const verify = zokratesProvider.verify(keypair.vk, proof);
  console.log("verify", verify)

});
