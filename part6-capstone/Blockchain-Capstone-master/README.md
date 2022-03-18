# Udacity Blockchain Capstone

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product. 

## TODOs
- deploy to testnet
- add openSeaMarketplace

## Run & Test 
1. npm install
2. Run diverse test scripts

Optional: run util.js => it will generate a new verifier contract + all needed proofs (valid + invalid ones) for testing and deploying. 

Metadata is here: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/[TOKENID]
e.g. https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1

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
