//A migration is a deployment script meant to alter the state of your application's contracts
// The transfer is per default done by account[0]
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  //deployer.deploy(MyContract, { from: "0xACCOUNT" });
};
