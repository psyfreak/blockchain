import {getMessageFunction, setMessageFunction, load} from "../lib/global.js";
// Get the contract address

// Static Import
//import json from "/build/contracts/Message.json";
//console.log(json);


let abiGanache = [
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
  contractAddressGanache = '0x0C17738b4Efc521f00BcfC6862b22dc4C33421b8';
//load(abiGanache, contractAddressGanache);
const rinkebyABI = [
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
  rinkebyContractAdress = "0x5df189Ce26E7238060aE8f624EAECa99cF6536Bc"
load(rinkebyABI, rinkebyContractAdress);

// make functions global
window.setMessageFunction = setMessageFunction;
window.getMessageFunction = getMessageFunction;