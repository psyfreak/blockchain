const { task } = require("hardhat/config");
const { getContract } = require("./helpers");
const fetch = require("node-fetch"); // only with old version npm install node-fetch@2
//import fetch from 'node-fetch'; n

task("mint", "Mints from the NFT contract")
  .addParam("address", "The address to receive a token")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    const transactionResponse = await contract.mintTo(taskArguments.address, {
      gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
  });

task("set-base-token-uri", "Sets the base token URI for the deployed smart contract")
  .addParam("baseUrl", "The base of the tokenURI endpoint to set")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    const transactionResponse = await contract.setBaseTokenURI(taskArguments.baseUrl, {
      gasLimit: 500_000,
    });
    console.log(`Transaction Hash: ${transactionResponse.hash}`);
  });

/**
 * This addition to the contract will make it so that calling tokenURI() for any
 * of our minted tokenIds will return the baseTokenURI + tokenId without any additional work on our end.
 */
task("token-uri", "Fetches the token metadata for the given token ID")
  .addParam("tokenId", "The tokenID to fetch metadata for")
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract("NFT", hre);
    // baseTokenURI + tokenId
    const response = await contract.tokenURI(taskArguments.tokenId, {
      gasLimit: 500_000,
    });

    const metadata_url = response;
    console.log(`Metadata URL: ${metadata_url}`);

    const metadata = await fetch(metadata_url).then(res => res.json());
    console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`);
  });