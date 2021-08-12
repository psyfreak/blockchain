# Test Project truffle

one can see two transactions after truffle migrate
1. CONTRACT CREATION (Migration contract)
2. CONTRACT Call (Migration contract call ())

## Extend contracts
see https://gus-tavo-guim.medium.com/using-truffle-to-create-and-deploy-smart-contracts-95d65df626a2
https://www.trufflesuite.com/docs/truffle/quickstart

1. add new contract
2. add new migrations file and add all new contracts
3. truffle migrate
   now again one contract creation call for each contract and one towards migration contract
   call setCompleted method.
   
   
On ganache no metamask used

## Metamask & Ganache
https://medium.com/@kacharlabhargav21/using-ganache-with-remix-and-metamask-446fe5748ccf

**Important** InjectedWeb3 is obsolete only with legacy metamsk plugin 

· JavaScript VM : This lets you run your contract directly in the browser using a JavaScript implementation of the Ethereum virtual machine (EVM). It is good for simple testing but each time when you reload the page it will start a new blockchain.
· Injected Web3 : Web3 is the interface for interacting with an Ethereum node. When you install Metamask, it injects web3 implementation into every web page. Using this option, you can use that injected implementation to deploy your contract to test networks or main Ethereum network.
· Web3 Provider : Using this option you can directly connect to an Ethereum node via HTTP. You can use this option to connect to Ganache or Geth.


You can connect directly from remix or truffle to ganache without embedding metamask
if you connect to test or mainnet you need to add metamask
Infura?

Metamsk is a bridge from browser to blockchain.


# Using REMIX
Deploy to rinkeby
1. MetaMask config
2. a. Select in meta mask rinkeybi network and 
2. b. change account to rinkeby one
3. Compile contract and copy ABI
4. Deploy: select environment injected web3 
   You should see the network selected in 2.a
5. Deploy (Metamsk should popup to confirm contract deployment fees / if no metamask confirmation popup switch to rinkeby account )
6. Copy contract address in deploy last contract

=> If you switch meta mask config different network and/or account you need to deploy again in remix if you have injected environment
=> It might happen that metamsk is not connect with your index.hmtl website so you need to press connect in metamask
=> IMPORTANT: It takes some seconds to show the new message in comparison to ganache due to consensus algorithm. 