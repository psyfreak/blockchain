const Web3 = require("web3");
//
//

let urlMain = "https://mainnet.infura.io/v3/d9e5d95ca8ab4661b173422d152485fd",
  urlTestRinkeby = "https://rinkeby.infura.io/v3/d9e5d95ca8ab4661b173422d152485fd",
  urlLocal = "HTTP://127.0.0.1:7545";
let web3 = new Web3(urlLocal);
console.log("1eth to wei", web3.utils.toWei(1));
/*
let fromAddress = "0x3ff2D686fb4fF41BaC3AA32C56d1f1eb6B519575";
web3.eth.getBalance((fromAddress))
  .then(response => {
    console.log("getBalance", response);
    let ethBalance = response / web3.utils.unitMap.ether;
    //web3.utils.fromWei(balance, 'ether')
    console.log("getBalance eth", ethBalance);
  });
web3.eth.getAccounts().then(response => {
  console.log("getAccounts", response);
});

 */
web3.eth.getGasPrice().then(result=>{
  console.log("gas", result);
  console.log("gas gwei", web3.utils.fromWei(result, 'gwei'));
})
web3.eth.getBlockTransactionCount(12870106).then(result=>{
  console.log("getBlockTransactionCount", result);
})
// https://etherscan.io/uncles // https://etherscan.io/block/12870141
web3.eth.getUncle(12870141,0).then(result=>{
  console.log("getUncle", result);
})

web3.eth.getNodeInfo().then(result=>{
  console.log("getNodeInfo", result);
})

/*
web3.eth.getUncle().then(result=>{
  console.log("gas", result);
  console.log("gas gwei", web3.utils.fromWei(result, 'gwei'));
})

//console.log("web3", web3);
//https://etherscan.io/tx/0x08a5f8319b837a980298910281990d99240bc84547887493876f572b5b10917b
/*
let trans = "0xb8d4eb2c458f28c8e082582df08653aa13521c617b4d38f51653b211683343f9";
let transaction = web3.eth.getTransaction(trans).then(response => {
  console.log("transaction", response);
});

let fromAddress = "0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A";
web3.eth.getBalance((fromAddress))
  .then(response => {
    console.log("getBalance", response);
    let ethBalance = response / web3.utils.unitMap.ether;
    //web3.utils.fromWei(balance, 'ether')
    console.log("getBalance eth", ethBalance);
  });
*/


/*
//Rinkeby own contract
function getContract(contractAddress, contractAbi) {
  return new web3.eth.Contract(contractAbi, contractAddress)
}

let ownABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "x",
        "type": "string"
      }
    ],
    "name": "setMessage",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getMessage",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
],
  ownContractAddress = "0xcF175353Da9bAFFF2A8F6A71c85d9275BdeF1970";

let contract = getContract(ownContractAddress, ownABI);
console.log("contract.methods", contract.methods);
contract.methods.getMessage().call((err, result) => {
  console.log("getMessage()", result);
  console.log("err", err )
})

 */
/*
// MAINNET
// important url => mainnet...
let abi = [{"constant":true,"inputs":[],"name":"batFundDeposit","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"batFund","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokenExchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"finalize","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"refund","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"tokenCreationCap","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"isFinalized","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fundingEndBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ethFundDeposit","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"createTokens","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"tokenCreationMin","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"fundingStartBlock","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_ethFundDeposit","type":"address"},{"name":"_batFundDeposit","type":"address"},{"name":"_fundingStartBlock","type":"uint256"},{"name":"_fundingEndBlock","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"LogRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"CreateBAT","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]
let contractAddress = '0x0D8775F648430679A709E98d2b0Cb6250d2887EF'
let contract = new web3.eth.Contract(abi, contractAddress)
console.log("contract.methods", contract.methods);




contract.methods.name().call((err, result) => {
  console.log("name()" );
  console.log("res", result );
  console.log("err", err )
})
//contract.methods.symbol().call((err, result) => { console.log(result )})
//contract.methods.totalSupply().call((err, result) => { console.log(result )})
*/