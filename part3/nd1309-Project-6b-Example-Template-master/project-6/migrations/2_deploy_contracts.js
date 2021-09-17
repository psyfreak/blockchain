// migrating the appropriate contracts
var FarmerRole = artifacts.require("./FarmerRole.sol");
var DistributorRole = artifacts.require("./DistributorRole.sol");
var RetailerRole = artifacts.require("./RetailerRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var Accessible = artifacts.require("./Accessible.sol");
var Mortal = artifacts.require("./Mortal.sol");
var Ownable = artifacts.require("./Ownable.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");


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
