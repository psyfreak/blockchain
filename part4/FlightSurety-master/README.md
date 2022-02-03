# FlightSurety
## TODO 
- add airline name
- passenger info i.e. insurances + payment open or not
- getBalances
- getOracleInfo (server)
- UI
    3) Passengers can choose from a fixed list of flight numbers and departures that are defined in the Dapp client
    Your UI implementation should include:
        Fields for Airline Address and Airline Name
        Amount of funds to send/which airline to send to
        Ability to purchase flight insurance for no more than 1 ether

https://ethereum.stackexchange.com/questions/12920/what-does-the-keyword-super-in-solidity-do
https://ethereum.stackexchange.com/questions/93701/security-implementation-of-a-function-in-solidity


  1. Truffle migrate —network development
    2. Truffle test ./test/oracles.js —network development
- move setter/getter require

- add https://github.com/adamgruber/mochawesome
- change data structures of insurance to avoid for loop

- improve comments for getter/setter

- change constants back
  - min-responses oracles
  - oracles registration fee wei to ether 
  - max insurance payment
  - airline initial funding in all caps and bottoms etc.

- https://jsfiddle.net/Alorel/5h6ztc4r/ console to 

Question adding:
- Why no interface when including dataContract in app / old solidity version?
- Transfer in data contract

// checked https://github.com/JeromeSolis/dapp-flight-surety/blob/main/contracts/FlightSuretyApp.sol
https://medium.com/hellogold/ethereum-multi-signature-wallets-77ab926ab63b
https://medium.com/hellogold/ethereum-multi-sig-wallets-part-ii-19077f6280a

https://github.com/ConsenSys-Academy/multisig-wallet-exercise/tree/master/contracts

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
 
## Remarks + Questions
### Remarks
- Changed Dapp
- Provide server routes to register orcales + get Indices (dev)
- Identification of a flight

* Which contract should hold the money. Data contract is permanent (i.e. with immortal key-value store), but additional transfers etc. more gas costs
  Similar to data contract split in general I assume.

* Registered airlines means only registerd = true but not neccessarily funded.
  Only registered airlines can register other airlines.
  Only funded airlines though can either register flights and therefore play in the in insurance game.
* also implemented refund etc.
* I transferred randomization and key to Util library i.e. I got rid of nonce as state var
* All money is hold within the data contract, which is sth. I am not sure about i.e. about increasing gas costs.
Furthermore one needs to transfer the money, when data contract gets updated. I think it might be better to hold the ether in the app contract.
* One particular flight can be identified by airline, flight, and timestamp      

* createInsurance (better set this fct. payable or extra msg. value and work with app payable and transfer function?)
- withDraw in data contract ?!??!?!
- TX.origin or msg.sender as parameter in contract to contract transfers (imo if data contract can only be called by app contract, then use of tx.origin would be fine
  and therefore we do not need the additional parameter. I only added em because I read that tx.origin should not be used for future compatibility)
  
- what is the purpose of using contract.new() function in test-config.js. We already deploy the contract during tests with the migration script, which is 
  running every time one uses test. It would mean that we deploy the contract twice, which needs more time. Is this right?
  
- initialization script versus ctor init
- withdraw function in dataContract???!
- withdraw transfer etc.
- Intentionally implemented two solutions for the multiparty consensus 
  - Default solution for registerFlight
  - Multi Sig solution based on this exercise: https://github.com/ConsenSys-Academy/multisig-wallet-exercise/tree/master/contracts

While the former has the advantage of smaller overhead, I found the extensibility not optimal.
The second example I like in terms of transactionId and the anonimity..


- Inheritance in solidity (App is an Oracle)
  Normally you you would implement an association or static class (but neither a library (no state variables possible) fit or another contract to interact with (too expensive))
  
  - Issue Authentication inherits from Ownable as well as DataContract (two different instances?)
  - Diamond issue - want to move all entity related functions e.g. registerAirline to Airline Entity, but it would mean that each entity needs to inherit from authentication 

- Msg.sender change Contract A call Contract B (in contract b msg.sender is contract A and tx.origin is the original msg.sender of contract A, 
  but what happens if the function in contract B calls another function in contract B (I assume the msg.sender remains (=contract A)))
  Am I right?

### Deployment 
- initialization of airline can be done in deployment script, in contract ctor or via init function.
The choice you made have different impact on the project.

Ctor:
- Advantage: everything in one place and you can be sure, that everything is automatically initalized
-  

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
- Dapp change webpack-dev-server to webpack serve https://stackoverflow.com/questions/40379139/cannot-find-module-webpack-bin-config-yargs/41182205
  "webpack serve --config config/webpack.dev.js --progress"
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