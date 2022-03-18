# Udacity Blockchain Capstone

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product. 

## TODOs
- deploy to testnet
- add openSeaMarketplace

## Run & Test 
1. npm install
2. Run diverse test scripts

``truffle migrate --reset --network rinkeby``

Optional: run util.js => it will generate a new verifier contract + all needed proofs (valid + invalid ones) for testing and deploying. 

Metadata is here: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/[TOKENID]
e.g. https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1

## Docs
- Listing OpenSea: https://testnets.opensea.io/collection/housetoken-2rnessub6o
- Token 0 - 4 were on sale 
- Token 0: https://testnets.opensea.io/assets/0xab93a9a40dfb367da3a1c852654540a20528b936/0
- ....
- Token 4: https://testnets.opensea.io/assets/0xab93a9a40dfb367da3a1c852654540a20528b936/4


## Update project to solidity 0.8
- Update openzeppelin
- Update oracalize 
  - Change byte to bytes1
  - Call functions - see https://stackoverflow.com/questions/69053074/solidity-assembly-error-builtin-function-gas-must-be-called
    - Line 1095: mstore(add(unonce, 0x20), xor(blockhash(sub(number, 1)), xor(coinbase, timestamp))) => mstore(add(unonce, 0x20), xor(blockhash(sub(number(), 1)), xor(coinbase(), timestamp())))
    - Line 1331: from codecopy(fmem, codesize, sub(msize, fmem)) => codecopy(fmem, codesize(), sub(msize(), fmem))
    - change format to set gas price return oraclize.queryN.value(price)(0, _datasource, args); => return oraclize.queryN{value: price}(0, _datasource, args);
    - change OraclizeI to abstract contract
  - update uinttostring to solidity 0.8.0 (endless loop before) see https://stackoverflow.com/questions/47129173/how-to-convert-uint-to-string-in-solidity

## Remarks
### Project
- mintToken uses the hash of the solution as the tokenId
### Zokrates
- Fiddling around to generate an invalid proof. If you test with web3 in test.js files, then you can only change the inputs. Changing the proof lead to invalid opcode error, which seems to be an issue on ganache - in zokrate.js it shows invalid. 
- Whenever you generate new verifier code, though the code did not change, you must also generate new proofs, otherwise you always get invalid proofs.

### Solidity
- I was not able to name the mint function just mint. it seems the compile has issues with overloading. whenever I called the function with 5 arguments, solidity compiler tries to call the mind in ERC721 with two arguments.
  For this reason I needed to change the name.

### OpenSea
- If I add the token in metamask before I connect to OpenSea, I see the items automatically.

# Further references & help
- https://andresaaap.medium.com/capstone-real-estate-marketplace-project-faq-udacity-blockchain-69fe13b4c14e

# References
## General solidity
- https://solidity-by-example.org/hashing/
- https://knowledge.udacity.com/questions/720350
- https://andresaaap.medium.com/capstone-real-estate-marketplace-project-faq-udacity-blockchain-69fe13b4c14e

## Open Sea
- https://www.youtube.com/watch?v=_fWfPVL6wOA&ab_channel=NFTTIMES

## Zksnark
- https://consensys.net/blog/developers/introduction-to-zk-snarks/
- https://blog.gnosis.pm/getting-started-with-zksnarks-zokrates-61e4f8e66bcc
- https://z.cash/technology/zksnarks/
- https://blog.ethereum.org/2016/12/05/zksnarks-in-a-nutshell/
- https://medium.com/@VitalikButerin/zk-snarks-under-the-hood-b33151a013f6
- https://medium.com/@VitalikButerin/quadratic-arithmetic-programs-from-zero-to-hero-f6d558cea649
- https://medium.com/@VitalikButerin/exploring-elliptic-curve-pairings-c73c1864e627
- https://gitter.im/ZoKrates/Lobby?at=5cb6939d6a84d76ed8a72e7f
- https://blog.decentriq.ch/zk-snarks-primer-part-one/ (shameless plug for a blog post I co-authored)
- https://qed-it.com/2017/12/20/the-incredible-machine/
- https://medium.com/qed-it/diving-into-the-snarks-setup-phase-b7660242a0d7

### Samples:
- https://101blockchains.com/zero-knowledge-proof-example/

## ERCs
- https://eips.ethereum.org/EIPS/eip-165
- https://eips.ethereum.org/EIPS/eip-721

## Docker
- https://earthly.dev/blog/docker-volumes/

## Walkthrough
- see https://www.youtube.com/watch?v=0pY1Sd7aDjM&ab_channel=AndresPinzon
- https://stackoverflow.com/questions/67743830/zokrates-invalid-witness-produces-valid-proof
````
wsl --unregister docker-desktop
wsl --unregister docker-desktop-data
````

``docker run -v E:\E\Education\blockchain\dev\repos\blockchain\part6-capstone\Blockchain-Capstone-master:/home/zokrates/code -ti zokrates/zokrates /bin/bash``

in tutorial ``docker run -v E:\E\Education\blockchain\dev\repos\blockchain\part6-capstone\Blockchain-Capstone-master\zokrates\code:/home/zokrates/code -ti zokrates/zokrates /bin/bash``

1. zokrates compile -i ./code/square/square-new.code
2. zokrates compute-witness -a 3 9
3. zokrates setup && zokrates export-verifier
4. zokrates generate-proof
5. zokrates verify


````
  
  # compile
  zokrates compile -i root.zok
  # perform the setup phase
  zokrates setup
  # execute the program
  zokrates compute-witness -a 337 113569
  # generate a proof of computation
  zokrates generate-proof
  # export a solidity verifier - Generated smart contract is tied to to the code previously compled.
  zokrates export-verifier
  # or verify natively
  zokrates verify
````

# Project Resources

* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin ](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)


- https://101blockchains.com/consensus-algorithms-blockchain/


Games
- https://101blockchains.com/gamefi/
- https://101blockchains.com/top-crypto-liquidity-pools/

## Additional communication about verify
@kosecki123 Mai 20 2021 13:41
Hey frens, starting with Zokrates toolbox and have a simple question about the verification process.
I followed the https://zokrates.github.io/gettingstarted.html example with root.zok
Using this
````
# compile
zokrates compile -i root.zok
# perform the setup phase
zokrates setup
# execute the program
zokrates compute-witness -a 337 113569
# generate a proof of computation
zokrates generate-proof
# export a solidity verifier
zokrates verify
````
returns "PASSED" result as expected, but when using same example but with WRONG secret value for witness generation like
````
# compile
zokrates compile -i root.zok
# perform the setup phase
zokrates setup
# execute the program
zokrates compute-witness -a 1337 113569
# generate a proof of computation
zokrates generate-proof
# export a solidity verifier
zokrates verify
````
also resulting with PASSED result from verify function.

Is that expected? I'm pretty sure I don't get something obvious with this setup, right?


Darko Macesic
@dark64
Mai 24 2021 13:23
Your setup is fine, part of the answer is actually in the comment "# generate a proof of computation". You are not generating a proof that the program resulted in a "true" value, you are generating a proof that you have run the computation. In other words, you can generate a valid proof that proves you have run the computation that resulted in a "false" value. That is why you get a "PASSED" result from the verify command, for this to fail you must fiddle with the actual generated proof (eg. by changing something in the proof.json)

Gerald Host
@GeraldHost
Mai 28 2021 21:05
I also came across this. (very new to ZK so apologies for the dumb question). I'm trying to understand this in practice. Am I correct in thinking that this basic example program doesn't prove the the person who generated the proof knows that "a * a == b"?

Darko Macesic
@dark64
Mai 28 2021 23:11
This can be confusing because the example returns a logical value (a boolean), but you can write a program that returns something else, for example, a hash. In this case, a verifier wants to verify that the prover executed your program with his or her private data (a preimage of the hash) presented by the witness, which he or she used to generate the proof. The verifier can then verify this proof, which proves that the prover actually executed this code and obtained these results. If you want to check a certain value, you can assert in your program or check the output (check the inputs field in proof.json, the last element is the result of the program which is a part of the proof, if you change this to something else the proof becomes invalid).

Gerald Host
@GeraldHost
Mai 28 2021 23:18
Ahh I understand now, it has just clicked! Thank you 🙌


# Output
## Deplyoment rinkeby
Migrations dry-run (simulation)
===============================
> Network name:    'rinkeby-fork'
> Network id:      4
> Block gas limit: 29999972 (0x1c9c364)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > block number:        10346919
   > block timestamp:     1647576941
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.972281048799803808
   > gas used:            255400 (0x3e5a8)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.0005108 ETH

   -------------------------------------
   > Total cost:           0.0005108 ETH


2_deploy_contracts.js
=====================

   Deploying 'Verifier'
   --------------------
   > block number:        10346921
   > block timestamp:     1647576947
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.969140574799803808
   > gas used:            1542699 (0x178a2b)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.003085398 ETH


   Deploying 'SolnSquareVerifier'
   ------------------------------
   > block number:        10346922
   > block timestamp:     1647576974
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.961417500799803808
   > gas used:            3861537 (0x3aec21)
   > gas price:           2 gwei
   > value sent:          0 ETH
   > total cost:          0.007723074 ETH

   -------------------------------------
   > Total cost:         0.010808472 ETH


Summary
=======
> Total deployments:   3
> Final cost:          0.011319272 ETH





Starting migrations...
======================
> Network name:    'rinkeby'
> Network id:      4
> Block gas limit: 29970705 (0x1c95111)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x9ee435d34824082c492368368eb2ebc90c0148b3e75f395c673c7f80416890ec
   > Blocks: 1            Seconds: 16
   > contract address:    0x288e1c8b1C411CeF314f39bFb8FefC96a6FC3fBD
   > block number:        10346922
   > block timestamp:     1647577007
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.972384301562992808
   > gas used:            271700 (0x42554)
   > gas price:           1.49998983 gwei
   > value sent:          0 ETH
   > total cost:          0.000407547236811 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.000407547236811 ETH


2_deploy_contracts.js
=====================

   Deploying 'Verifier'
   --------------------
   > transaction hash:    0xb258a4e437da9846a6ca9ab329fe0e4b8e2720f5cb272d33ab14cd686ce2c80a
   > Blocks: 1            Seconds: 12
   > contract address:    0xBFF5be92Bf47fc9FE5a46D6Bc3158ABb965F1179
   > block number:        10346924
   > block timestamp:     1647577037
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.970001361829948209
   > gas used:            1542699 (0x178a2b)
   > gas price:           1.499990097 gwei
   > value sent:          0 ETH
   > total cost:          0.002314033222651803 ETH


   Deploying 'SolnSquareVerifier'
   ------------------------------
   > transaction hash:    0x3e2901a34741b549933df1f7e19499ad6b605e022f83b40dff186a791715fb9b
   > Blocks: 1            Seconds: 8
   > contract address:    0xaB93A9a40DFB367da3a1c852654540a20528b936
   > block number:        10346925
   > block timestamp:     1647577052
   > account:             0x0b942ab0761F6AAbEd2de1d6fe64138942b6904A
   > balance:             0.963939844291449787
   > gas used:            4041037 (0x3da94d)
   > gas price:           1.499990606 gwei
   > value sent:          0 ETH
   > total cost:          0.006061517538498422 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:     0.008375550761150225 ETH


Summary
=======
> Total deployments:   3
> Final cost:          0.008783097997961225 ETH
