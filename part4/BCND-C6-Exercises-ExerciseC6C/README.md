# Exerice C
1. Create application contract 
    - add file ExerciceseC6CApp.sol by using code in snipptes/C/ExerciseC6CApp.txt
2. Move application logic

Actually AppContract use in its ctor the address of the data contract, thus the data contract must be deployed before the app contract.
You can do this either in the ctor or delay it and set the data contract address in another function etc.
The ctor is not deployed, but the state changes done in the ctor.
The app is unidrectional connected to the dataContract.


## Additional references
- https://blockgeeks.com/introduction-to-solidity-part-1/


## Blockchain Course 6 Exercises

To install, download or clone the repo, then move to the required exercise branch with either:

- `git checkout ExerciseC6A`
- `git checkout ExerciseC6B`
- `git checkout ExerciseC6C`
- `git checkout ExerciseC6D`

and for each exercise run:

`npm install`
`truffle compile`

## Develop

To run truffle tests:

`truffle test ./test/ExerciseC6A.js` or `npm test`

## Resources

* [How does Ethereum work anyway?](https://medium.com/@preethikasireddy/how-does-ethereum-work-anyway-22d1df506369)
* [Truffle Framework](http://truffleframework.com/)
* [Ganache Local Blockchain](http://truffleframework.com/ganache/)
* [Solidity Language Reference](http://solidity.readthedocs.io/en/v0.4.24/)
* [Ethereum Blockchain Explorer](https://etherscan.io/)
* [Web3Js Reference](https://github.com/ethereum/wiki/wiki/JavaScript-API)* [BIP39 Mnemonic Generator](https://iancoleman.io/bip39/)
* [Remix Solidity IDE](https://remix.ethereum.org/)

## Versions

This code was created with the following versions of tools:

* Truffle v5.0.1 (core: 5.0.1)
* Solidity v0.5.0 (solc-js)
* Node v8.9.4
* Ganache v1.2.3

## Troubleshooting

* Ensure Ganache is running on port 8545
* Ensure Ganache mnemonic is identical to mnemonic in truffle.js
* Ensure you have at least the versions of the tools specified above
* Delete node_modules folder and run "npm install" to refresh dependencies
* If you get compiler errors, change the "pragma" line in all .sol files to match your version
