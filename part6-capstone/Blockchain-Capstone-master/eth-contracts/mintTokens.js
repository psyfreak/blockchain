/**
 generate config - see hardhat
 **/
//mint 10 tokens on rinkeby
//const Web3 = require("web3")
//import Web3 from 'web3';
// Get web3
//let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const result = require('dotenv').config({ path: './eth-contracts/.env' });
if (result.error) {
  throw result.error
}
console.log("Loaded config: ", result.parsed);
const { ACCOUNT_PRIVATE_KEY, INFURA_KEY, INFURA_PRIVATE_KEY, INFURA_mnemonic, NFT_CONTRACT_ADDRESS_LOCAL, NFT_CONTRACT_ADDRESS_RINKEBY } = process.env;

const fs = require('fs'),
  path = require('path'),
  HDWalletProvider = require('truffle-hdwallet-provider'),
  Web3 = require('web3'),
  //web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
  web3 = new Web3(new HDWalletProvider(INFURA_mnemonic, `https://rinkeby.infura.io/v3/${INFURA_KEY}`))
  ;
var SolnSquareVerifier = require('./build/contracts/SolnSquareVerifier.json');
const solnSquareVerifier = new web3.eth.Contract(SolnSquareVerifier.abi, NFT_CONTRACT_ADDRESS_RINKEBY);
//const solnSquareVerifier = new web3.eth.Contract(SolnSquareVerifier.abi, NFT_CONTRACT_ADDRESS_LOCAL);

let path1 = path.join(__dirname, "../zokrates/res/proofs.json");
let rawdata = fs.readFileSync(path1);
const proofs = JSON.parse(rawdata);


// 10 HouseTokens were created
(async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    web3.eth.defaultAccount = accounts[0];
    console.log("web3.eth.accounts", accounts)
    console.log("web3.eth.defaultAccount [0]", web3.eth.defaultAccount);
    for(let i = 0; i < 10; i++) {
      console.log("mintToken no/input ", i, proofs[i].inputs)

      let minted = await solnSquareVerifier.methods
        .mintToken(proofs[i].proof, proofs[i].inputs, web3.eth.defaultAccount)
        .send({from: web3.eth.defaultAccount, value: 0, gas: 2800707 });
      console.log("minted", minted);
    }

  } catch (e) {
    // Deal with the fact the chain failed
    console.log("error", e.message)
  }
  // `text` is not available here
})();