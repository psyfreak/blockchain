// migrating the appropriate contracts
const SquareVerifier = artifacts.require("Verifier.sol");
//const SolnSquareVerifier = artifacts.require("SolnSquareVerifier.sol");
const ERC721Mintable = artifacts.require("ERC721Mintable.sol");

module.exports = function(deployer) {
  deployer.deploy(SquareVerifier);
  //deployer.deploy(SolnSquareVerifier);
  deployer.deploy(ERC721Mintable, "HouseToken", "HT");
  /*
  await deployer.deploy(FlightSuretyData, firstAirline, {value: FUNDING_AIRLINE});
  let flightSuretyDataInstance = await FlightSuretyData.deployed();

  await deployer.deploy(FlightSuretyApp, FlightSuretyData.address, MultiSignatureWallet.address); // parameter must set as an address, {value: 10});
  let flightSuretyAppInstance = await FlightSuretyApp.deployed();
  */
  // mint 10 tokens

};
