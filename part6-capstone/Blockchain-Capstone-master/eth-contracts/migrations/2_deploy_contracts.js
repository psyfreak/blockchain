// migrating the appropriate contracts
const SquareVerifier = artifacts.require("Verifier.sol");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier.sol");
//const ERC721Mintable = artifacts.require("ERC721Mintable.sol");

module.exports = async function(deployer) {
  await deployer.deploy(SquareVerifier);

  let squareVerifierInstance = await SquareVerifier.deployed();

  await deployer.deploy(SolnSquareVerifier, SquareVerifier.address); // parameter must set as an address, {value: 10});
  let solnSquareVerifierInstance = await SolnSquareVerifier.deployed();
  //deployer.deploy(ERC721Mintable, "HouseToken", "HT");

  // mint 10 tokens

};
