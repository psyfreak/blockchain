// migrating the appropriate contracts
var FarmerRole = artifacts.require("./FarmerRole.sol");
var DistributorRole = artifacts.require("./DistributorRole.sol");
var RetailerRole = artifacts.require("./RetailerRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var Accessible = artifacts.require("./Accessible.sol");
var Mortal = artifacts.require("./Mortal.sol");
var Ownable = artifacts.require("./Ownable.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");
/*
Feedback Udacity:
You'll only need to deploy the base contract (SupplyChain) since you will be inheriting the code of the other contracts.
That means their code is already imported within the base contract. You only need to deploy separate contracts
if you need them to be separate and you're going to make external calls.
That's what you'll be doing in the next project (FlightSurety) and you will be doing external calls to other contracts in the network.
That is not needed in this project.
You'll find that all your tests will still work with this code:
// migrating the appropriate contracts
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(SupplyChain);
};
 */

module.exports = function(deployer) {
  deployer.deploy(FarmerRole);
  deployer.deploy(DistributorRole);
  deployer.deploy(RetailerRole);
  deployer.deploy(ConsumerRole);
  deployer.deploy(Accessible);
  deployer.deploy(Mortal);
  deployer.deploy(Ownable);
  deployer.deploy(SupplyChain);
};
