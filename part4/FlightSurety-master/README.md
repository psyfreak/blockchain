# FlightSurety


FlightSurety is a sample application project for Udacity's Blockchain course.
https://medium.com/quillhash/how-to-write-upgradable-smart-contracts-in-solidity-d8f1b95a0e9a

1. passenger purchase insurance
   mapping flight to passenger struct - holds address name, insurance money
   if flight is good, one 
2. flight arrival
   1. Status is fine (airlines hold money)
   2. Status is delayed (passengers get payout - iterate over passengers)
      and add insurance * 1.5 to balance (increment existing amount)
      
3.      
      


## Requirements

### Passengers
Passengers can purchase a flight insurance with an arbitrary amount of money upto 1 ether for a specific flight.
Specific flight means we map a flight key (getFlightKey) upon insurance money.

If flight is delayed due to airline fault passenger receives credit of 1.5x the amount they paid.



addressToPassenger credit (sum of all airline delays)

Assumptions:
- Passengers can invest several times but not more thant 1 ether. 

## Questions & Remarks
- Where should one save the funds? In data or app contract?
  What are best practices?

## Drawbacks.
* Airline split - a well functioning airline has to pay for bad function airlines.
* If contract has no funding - contract will be dead (should be set to operational = false) until new airlines return (or existing airlines refund which is not implemented)


## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install, download or clone the repo, then:

`npm install`
`truffle compile`

Please update the following libraries before useage
- web3
- truffle
- hd-wallet provider
- solidity compiler updated to 0.8x
- openzeppelin-solidity
  - change import dir to 
  - add calldata/memory for string, array params and returns
  - get rid of visibilty modifier in constructors
  - Error: TypeError: Types in storage containing (nested) mappings cannot be assigned to
    change in solidity 0.7 (see https://stackoverflow.com/questions/64200059/solidity-problem-creating-a-struct-containing-mappings-inside-a-mapping)

    see solution here: https://howtofix.io/solidity-error-construction-of-struct-that-contains-a-nested-mapping-id1411686
- Fixing this article to fix node-gyp issues https://spin.atomicobject.com/2019/03/27/node-gyp-windows/ on Windows.  

## Develop Client

To run truffle tests:

`truffle test ./test/flightSurety.js`
`truffle test ./test/oracles.js`

To use the dapp:

`truffle migrate`
`npm run dapp`

To view dapp:

`http://localhost:8000`

## Develop Server

`npm run server`
`truffle test ./test/oracles.js`

## Deploy

To build dapp for prod:
`npm run dapp:prod`

Deploy the contents of the ./dapp folder


## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Remix Solidity IDE](https://remix.ethereum.org/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)