const Message = artifacts.require("Message");

module.exports = function (deployer) {
  deployer.deploy(Message);
  //deployer.deploy(MyContract, { from: "0xACCOUNT" });
};
