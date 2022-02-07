# FlightSurety

FlightSurety based on the following project [Rubric](./doc/UdacityProjectFlightSuretyRubric.pdf).
See detailed requirements (based on videos and introduction) of the project below.

## Overview
There are 4 independent contracts implementing 4 major components:
- App contract
- Oracles included in app contract
- Data Contract can be called by App and MultiSignatureWallet exclusively for any state changing operations.
  This is secured by the inherited Authentication contract.
- MultiSignatureWallet contract
  This is used only for setOperational to have an alternative and more flexible way to function as votable transactions.
  It is based on the following resources, though I enhanced and modified, so that airlines change the owner settings + history etc.:
  - https://medium.com/hellogold/ethereum-multi-signature-wallets-77ab926ab63b
  - https://medium.com/hellogold/ethereum-multi-sig-wallets-part-ii-19077f6280a
  - https://github.com/ConsenSys-Academy/multisig-wallet-exercise/tree/master/contracts
  
- Util contract/library to provide some generic functions.
  Actually I also wanted to try out using a library, and I thought it might be a good fit here. 

## Requirements 

### General
- Operational status control
    Every critical state changing function
- Use multiparty consensus also for such control to pause/unpause the contract.
  Use OpenZeppelin - https://forum.openzeppelin.com/t/what-is-pausable-sol-used-for-in-a-smart-contract/13548/3
- Functions fail fast

### Airlines
- First Airline gets deployed automatically (either via ctor or deployment script vs. manual later)
- Other airlines Need to register    
    - Only existing airlines may register new airlines, until 4 airlines are registered.
    - More or equal than 5 Airlines, a multiparty consensus technique with 50% majority is used for registration .
- Need for funding of 10 ether if airline would like to participating and the business model for insurances (register flights, passengers and sale of insurances).

### Passengers
- Passengers can purchase a flight insurance with an arbitrary amount of money upto 1 ether for a specific flight.
- Flight numbers and timestamps are fixed and can be defined in the dapp client.
- Add to config - check if copied config can be used in dapp as well
- If flight is delayed due to airline fault (only one statusId) passengers receive credit of 1.5X the amount they paid.
- Funds are transferred from smart contract by withdrawal
- Debit before credit

### Oracles
- 20+ oracles are registered
- Oracles have assigned indices which are persisted in memory
- Oracle registration cost 1 ether
- Client app is used to trigger fetchFlightStatu  to update flight status generating OracleRequest events that are captured by the server
- Sever will loop through all registered oracles, identify the proper ones and respond by calling into app logic (server triggers submit)
    - Take static status code and randomize it over the oracles.
    - Simulate that Some oracles answer differently than others and rely on the majority for the final decision.
    - Oracles in this scenario will be triggered, when I flight has landed etc. or have any other information e.g. 3rd party provider, but in our case we do it via dapp/UI/client.
    - Button triggers contract call to fetchFlightInformation
    - Initially 10 oracles, later 50/100 oracles
 
## Issues
Server Webpack has an effect on the event listener for Web3.
It seems that when you rebuild the existing event subscriptions are not unsubscribed and remain.
This lead to duplicate event triggers.
This could be reproduced by getting one duplicate more, when I trigger one rebuild while the server is running
(fetchFlightStatus one time, then change sth. in server/code or trigger live rebuild, then fetchFlightStatus again (2x events).
This has an effect on all server related stuff i.e. oracles (OracleReport event listener for fetchFlightStatus).

The returnValues object within the event emit is cannot be directly accces.
It seems it is a prototype class. I needed to implement 
 transformed to json (it seems that the prototype Result is persisted).

````
function transformEventReturnToJson(eventReturnValues) {
  console.log("transformEventReturnToJson", eventReturnValues);
  let retString = JSON.stringify(eventReturnValues);
  let parsesd = retString.replace("Result ", "");
  let parsedJson = JSON.parse(parsesd);
  return parsedJson;
}
// call
properJsonObject = transformEventReturnToJson(event.returnValues)
````
 
## Remarks + Questions

### Remarks
- I learnt a lot, which is good, but this project took me as long as the other projects together...
- Code and version are outdated. It took again some time to update everything. 
  It took time, but for other students the learning experience might be frustrating...
- Requirements are not 100% clear. 
- UI requirements not fully clear. I did not implement all UI guidelines, though they are essential for a final product.
- I extended the DAPP + Server:
    - Added some routes to the server i.e. to register oracles and to see  (good idea to )
    - Added/enhanced the logs (added one for the contract execution and one for the events) 
    - Provide server routes to register orcales + get Indices (for dev only)
    - Predefined indices to easily test oracles functions.
    - Websocket + Events - for the dapp it is needed, that one connects via Websockets.
    - Added refunding possibility. also implemented refund etc.
    - I transferred the pseudo randomization and other functions to Util library i.e. I got rid of nonce as a state var
    - Extended the config in the deployment script i.e. by flights, airlines etc. but also to setup the oracles
      i.e. you can change the mechanism 
- The data contract holds all money, which is sth. I am not sure about i.e. about increasing gas costs. See question in a later section.
- I implemented two solutions for the multiparty consensus, though there are some redundant parts.
  - Default solution for registerFlight
  - Multi Sig solution based on this exercise: https://github.com/ConsenSys-Academy/multisig-wallet-exercise/tree/master/contracts


### Questions

#### Requirements related
- It was not 100% clear for me what "participate at the contract" mean if a registered airline is funded.
  I implemented it in this way, that only "funded" airlines can register flights and therefore are able to utilize the insurance mechanics. 
- One particular flight can be identified by airline, flight, and timestamp
- Register airline has one additional parameter for name, which is only used at creation time, while it has no usage when you call register for voting
- I am not sure if all my transfers are properly implemented i.e. EOA to app contract and proxy to data contract and/or usage of receive vs. specific function calls.
  I am in hope for getting some feedback here... 

- Passengers can only purchase an insurance one time for flight. Might be better to invest several times but not more thant 1 ether aka the cap.

#### General

- In the lessons with solidity 0.4.x it was introduced to add a contract by adding a state variable + setting it, and forward declaring (interface implementation) the functions which are used from the included other contract.
  It seems that this is not needed anymore for solidity 0.8. Am I right?

- Is it better to return an empty object/struct or throwing an error resp. add a required.
  As you can see I added required to getFlight (and) other getters.

- Until right now we haven´t learnt something about "Delegate calls".  My impression is that this type of calls would fit very well.Delegate calls better then normal calls? i.e. to avoid an additional parameter for the prev. msg.sender when another 
  Afaik as I understood one can a contract with another context, which would get rid of these ugly sender parameters i.e. app (msg.sender) and data contract parameter for original msg.sender

- The previous point also lead to tx.origin. I used it for registeredBy for create airline and flight as well as in submitTransaction in MultiSignatureWallet, 
  but I was also tempted to use it to avoid ugly additional parameters in the data contract ie. to transfer the caller of the function.
  I think that we could get rid of any additional address parameter by consequently using the tx.origin, because through the authorization mechanism,
  that specific and authorized contracts can call the data contract, tx.origin will always be the original msg. sender of the app contract.
  I only added em because I read that tx.origin should not be used for future compatibility.
  Am I right and/or what is the actual approach here?

- fetchFlightStatus: Should the status still fetched if the flight has already a status and was processed?
  For testing purpose it might be good, but for prod it does not feel right. I.e.the open is set again to true.
  I mean there is not postprocessing, but the code is processed, though it does not give any further added value.
    
- What is the purpose of using contract.new() functions in test-config.js. Obviously it will instantiate the contract, but does it make sense to it again, because 
 the migration/deployment script will do this anyway?
 We already deploy the contract during tests with the migration script, which is 
  running every time one uses test. It would mean that we deploy the contract twice, which needs more time. Is this right?
  I did not instantiate the contract in the testConfig.js file again. 
    ````
    let flightSuretyData = await FlightSuretyData.new(firstAirline, {from: owner, value: 10});
    to
    let flightSuretyData = await FlightSuretyData.deployed();
    ````

- As you can see in my data contract code I also implemented an initialization script, which I used first. versus ctor init
  I also explicitly called the funding method in my deploy script, but finally I decided to use a payable ctor.
  What is the right way to initialize a contract?

- Inheritance in solidity (App is an Oracle) is very strange
  I have the impression that inheritance is used not in its original sense, but for splitting your code.
  Normally you  would implement an association or static class for the entities (Airlines, Flight etc.) but in a solidity/blockchain context it would increase costs
  (but neither a library (no state variables possible) fit or another contract to interact with (too expensive))
  I wanted to move all entity related functions to its dedicated contract/class (registerFlight in "Flight class", registerAirline to Airline class etc.)
  and I could not move it due to dependency issues i.e. Authentication and Ownable classes are needed for all entities.
  I was not sure what the best way is to implement this. Should I have done forward declare it in the entity classes and inherit only the child class or similar?

#### Separation of contracts (logic and app) withDraw in data contract 
- Which contract should hold the money and what are best practices?
  Data contract is permanent (i.e. with immortal key-value store), therefore it is better suited for holding the money, 
  but it also would lead to additional transfers etc. more gas costs.
  This might be the same drawback as splitting up the data and the app contract I assume.
  I would assume that normally there is dedicated "Wallet-Contract to hold the money".

- Transfer in data contract
  In general I thought about the data contract as a DAO or more as a model, so I am wondering if it is really good to have withdraw/transfer related stuff in the data contract?
  Additionally as mentioned above you need to transfer money from app to data contract for all value transactions, which does not feel right.

- As one example: createInsurance (better set this fct. payable or extra msg. value and work with app payable and transfer function?)
    I call it like this flightSuretyData.createInsuranceForFlight{value: msg.value}(flightKey, msg.sender, msg.value);
    But might it better to have this createInsuranceForFlight functnion not payable and transfer to the contract directly via receive?

- Is it better to move all modifiers and requires such as "isOperational" to the logic contract or having them in both or only app?  
  As you can see I put e.g. requireIsOperational in app and data contract functions, because I though this might be the most secure method.
  But I am wondering, what the best way is to do this? 
- Because of the above there is a lot of redundant code for modifiers. Is there a better way to structure them for exmaple via inheritance, library etc.?

## Install

This repository contains Smart Contract code in Solidity (using Truffle), tests (also using Truffle), dApp scaffolding (using HTML, CSS and JS) and server app scaffolding.

To install, download or clone the repo, then:

`npm install`
`truffle compile`

### Migration to the newest version (solidity, webpack, web3 etc.)
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

### Further TODO 
- Mini project to verify:
  Msg.sender change Contract A call Contract B (in contract b msg.sender is contract A and tx.origin is the original msg.sender of contract A,
  but what happens if the function in contract B calls another function in contract B (I assume the msg.sender remains (=contract A)))
  Am I right?

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
- https://medium.com/quillhash/how-to-write-upgradable-smart-contracts-in-solidity-d8f1b95a0e9a

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