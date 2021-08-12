# Setup

1. Change compiler version in truffle-config to 0.8.0 because open zepplin needs it...
2. You can



## Setup for Rinkeby
1. Add network in truffle-config.js
2. get mnemonic from metamask
3. get rinkeby from infura


## Add contract
Link file truffle-config.js in ganache

## run
truffle migrate --reset --network rinkeby



## Output
- Get transaction id and contract id here.
- Add token in rinkeby account 
````
E:\E\Education\blockchain\dev\03_Ethereum\erc20-token>truffle migrate --reset --network rinkeby

Compiling your contracts...
===========================
> Compiling .\contracts\Migrations.sol
> Compiling .\contracts\SampleToken.sol
> Compiling .\contracts\SimpleToken.sol
> Compiling .\contracts\SimpleToken.sol
> Artifacts written to E:\E\Education\blockchain\dev\03_Ethereum\erc20-token\build\contracts
> Compiled successfully using:
   - solc: 0.8.0+commit.c7dfd78e.Emscripten.clang



Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 29970705 (0x1c95111)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > block number:        9088661
   > block timestamp:     1628570138
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.997007328990229729
   > gas used:            229300 (0x37fb4)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.0004586 ETH

   -------------------------------------
   > Total cost:           0.0004586 ETH


2_simple_token.js
=================

   Deploying 'SimpleToken'
   -----------------------
   > block number:        9088663
   > block timestamp:     1628570152
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.994623844990229729
   > gas used:            1164229 (0x11c3c5)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.002328458 ETH

   -------------------------------------
   > Total cost:         0.002328458 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.002787058 ETH





Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 30000000 (0x1c9c380)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x5f78e466bca27c2e67f9106891063352c59688e56db3c6f816585cfa4d743488
   > Blocks: 3            Seconds: 40
   > contract address:    0x5063A8373B8E45B437d795468C200ee229136332
   > block number:        9088664
   > block timestamp:     1628570201
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.997465928990229729
   > gas used:            245600 (0x3bf60)
   > gas price:           1.000000008 gwei
   > value sent:          0 ETH
   > total cost:          0.0002456000019648 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.0002456000019648 ETH


2_simple_token.js
=================

   Deploying 'SimpleToken'
   -----------------------
   > transaction hash:    0xc329f1ed73df79855d2375d859185379943857749868cde849360884e1ad239f
   > Blocks: 1            Seconds: 12
   > contract address:    0x7C23eC50BaD7cF5C331Ae0072E5496f59b982fd3
   > block number:        9088666
   > block timestamp:     1628570231
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.995944986976786851
   > gas used:            1229429 (0x12c275)
   > gas price:           1.000000009 gwei
   > value sent:          0 ETH
   > total cost:          0.001229429011064861 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.001229429011064861 ETH


Summary
=======
> Total deployments:   2
> Final cost:          0.001475029013029661 ETH




E:\E\Education\blockchain\dev\03_Ethereum\erc20-token>
````