# ND1309 C2 Ethereum Smart Contracts, Tokens and Dapps - Project Starter 
**PROJECT: Decentralized Star Notary Service Project** - For this project, you will create a DApp by adding functionality with your smart contract and deploy it on the public testnet.

### Project Information

**ERC-721 Token Name**: 'Startoken'

**ERC-721 Token Symbol**: 'ST'

**Token/Contract Address Rinkeby**: 0x147FC97f7f089963ED2235950eAE4f7dDe0bDda8

**Token Address/Contract on the Rinkeby Network**:

**OpenZeppelin: package @openzeppelin/contracts / version**: "^4.2.0"
 
**Version of the Truffle and OpenZeppelin used (see package.json)**

Output truffle version
````
Truffle v5.4.5 (core: 5.4.5)
Solidity - 0.8.0 (solc-js)
Node v12.18.3
Web3.js v1.5.1
````

### REMARKS
I used the latest versions of all packages.
Updated all solidity functions in StarNotary.sol

### Output Deployment to rinkeby
````
E:\E\Education\blockchain\dev\03_Ethereum\p2-Decentralized-Star-Notary-Service-Starter-Code-main>truffle migrate --reset --network rinkeby

Compiling your contracts...
===========================
> Compiling .\contracts\Migrations.sol
> Compiling .\contracts\StarNotary.sol
> Compiling .\node_modules\@openzeppelin\contracts\token\ERC721\ERC721.sol
> Compiling .\node_modules\@openzeppelin\contracts\token\ERC721\IERC721.sol
> Compiling .\node_modules\@openzeppelin\contracts\token\ERC721\IERC721Receiver.sol
> Compiling .\node_modules\@openzeppelin\contracts\token\ERC721\extensions\IERC721Metadata.sol
> Compiling .\node_modules\@openzeppelin\contracts\utils\Address.sol
> Compiling .\node_modules\@openzeppelin\contracts\utils\Context.sol
> Compiling .\node_modules\@openzeppelin\contracts\utils\Strings.sol
> Compiling .\node_modules\@openzeppelin\contracts\utils\introspection\ERC165.sol
> Compiling .\node_modules\@openzeppelin\contracts\utils\introspection\IERC165.sol
> Artifacts written to E:\E\Education\blockchain\dev\03_Ethereum\p2-Decentralized-Star-Notary-Service-Starter-Code-main\build\contracts
> Compiled successfully using:
   - solc: 0.8.0+commit.c7dfd78e.Emscripten.clang



Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 29970677 (0x1c950f5)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > block number:        9099573
   > block timestamp:     1628734089
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.995353005976108398
   > gas used:            255388 (0x3e59c)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.000510776 ETH

   -------------------------------------
   > Total cost:         0.000510776 ETH


2_deploy_contracts.js
=====================

   Deploying 'StarNotary'
   ----------------------
   > block number:        9099575
   > block timestamp:     1628734098
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.989689619976108398
   > gas used:            2804155 (0x2ac9bb)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.00560831 ETH

   -------------------------------------
   > Total cost:          0.00560831 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.006119086 ETH





Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 29970649 (0x1c950d9)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x68f34fa4d757265a5ddee7d05cdedde45a36f91b8cb00cfa90d5de8d3988bfee
   > Blocks: 1            Seconds: 12
   > contract address:    0xf1dad411390101fFF484b1e46b1c8403B82045cd
   > block number:        9099574
   > block timestamp:     1628734119
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.995537756440498454
   > gas used:            271688 (0x42548)
   > gas price:           1.199999763 gwei
   > value sent:          0 ETH
   > total cost:          0.000326025535609944 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.000326025535609944 ETH


2_deploy_contracts.js
=====================

   Deploying 'StarNotary'
   ----------------------
   > transaction hash:    0xfee919231707e52c46c98dd7d778c29d0335dbb7564492d8617db006736b4b7f
   > Blocks: 0            Seconds: 8
   > contract address:    0x147FC97f7f089963ED2235950eAE4f7dDe0bDda8
   > block number:        9099576
   > block timestamp:     1628734150
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.992078525523696695
   > gas used:            2836755 (0x2b4913)
   > gas price:           1.199999763 gwei
   > value sent:          0 ETH
   > total cost:          0.003404105327689065 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.003404105327689065 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.003730130863299009 ETH
````

### Dependencies
For this project, you will need to have:
1. **Node and NPM** installed - NPM is distributed with [Node.js](https://www.npmjs.com/get-npm)
```bash
# Check Node version
node -v
# Check NPM version
npm -v
```


2. **Truffle v5.X.X** - A development framework for Ethereum. 
```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Specify a particular version
npm install -g truffle@5.0.2
# Verify the version
truffle version
```


2. **Metamask: 5.3.1** - If you need to update Metamask just delete your Metamask extension and install it again.


3. [Ganache](https://www.trufflesuite.com/ganache) - Make sure that your Ganache and Truffle configuration file have the same port.


4. **Other mandatory packages**:
```bash
cd app
# install packages
npm install --save  openzeppelin-solidity@2.3
npm install --save  truffle-hdwallet-provider@1.0.17
npm install webpack-dev-server -g
npm install web3
```


### Run the application
1. Clean the frontend 
```bash
cd app
# Remove the node_modules  
# remove packages
rm -rf node_modules
# clean cache
npm cache clean
rm package-lock.json
# initialize npm (you can accept defaults)
npm init
# install all modules listed as dependencies in package.json
npm install
```


2. Start Truffle by running
```bash
# For starting the development console
truffle develop
# truffle console

# For compiling the contract, inside the development console, run:
compile

# For migrating the contract to the locally running Ethereum network, inside the development console
migrate --reset

# For running unit tests the contract, inside the development console, run:
test
```

3. Frontend - Once you are ready to start your frontend, run the following from the app folder:
```bash
cd app
npm run dev
```

---

### Important
When you will add a new Rinkeyby Test Network in your Metamask client, you will have to provide:

| Network Name | New RPC URL | Chain ID |
|---|---|---|
|Private Network 1|`http://127.0.0.1:9545/`|1337 |

The chain ID above can be fetched by:
```bash
cd app
node index.js
```

## Troubleshoot
#### Error 1 
```
'webpack-dev-server' is not recognized as an internal or external command
```
**Solution:**
- Delete the node_modules folder, the one within the /app folder
- Execute `npm install` command from the /app folder

After a long install, everything will work just fine!


#### Error 2
```
ParserError: Source file requires different compiler version. 
Error: Truffle is currently using solc 0.5.16, but one or more of your contracts specify "pragma solidity >=0.X.X <0.X.X".
```
**Solution:** In such a case, ensure the following in `truffle-config.js`:
```js
// Configure your compilers  
compilers: {    
  solc: {      
    version: "0.5.16", // <- Use this        
    // docker: true,
    // ...
```

## Raise a PR or report an Issue
1. Feel free to raise a [Pull Request](https://github.com/udacity/nd1309-p2-Decentralized-Star-Notary-Service-Starter-Code/pulls) if you find a bug/scope of improvement in the current repository. 

2. If you have suggestions or facing issues, you can log in issue. 

---

Do not use the [Old depreacted zipped starter code](https://s3.amazonaws.com/video.udacity-data.com/topher/2019/January/5c51c4c0_project-5-starter-code/project-5-starter-code.zip)
