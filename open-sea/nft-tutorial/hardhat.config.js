/**
 * @type import('hardhat/config').HardhatUserConfig
 */
/*
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { ALCHEMY_KEY, ACCOUNT_PRIVATE_KEY } = process.env;

require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.1",
  // defaultNetwork: "hardhat", //rinkeby
  // networks: {
  //   hardhat: {},
  //
  //   rinkeby: {
  //     url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  //     accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
  //   },
  //   ethereum: {
  //     chainId: 1,
  //     url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  //     accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
  //   },
  // },
};
*/
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("./scripts/deploy.js");
require("./scripts/mint.js");

const { ALCHEMY_KEY, ACCOUNT_PRIVATE_KEY, INFURA_KEY, INFURA_PRIVATE_KEY, INFURA_mnemonic } = process.env;

module.exports = {
  solidity: "0.8.1",
  defaultNetwork: "rinkeby",
  networks: {
    hardhat: {},
    rinkeby: {
      url: `"https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
      //accounts: [`0x${INFURA_PRIVATE_KEY}`]
      //Array of initial accounts that Hardhat Network will create and each of this would be an object with privateKey and balance fields.
      // OR
      // An object describing an HD wallet. It is default and can have the following fields like mnemonic (a 12 or 24 word seed phrase as defined by BIP39), initialIndex (default value: 0), path (the HD parent of all derived keys), count (number of accounts to derive), accountsBalance (string with balance in wei for every derived account).
      /*
      accounts: {
        mnemonic: `${INFURA_mnemonic}`
      }
      */
    },
  }
  //  urlTestRinkeby = ",

  //
  // networks: {
  //   hardhat: {},
  //   rinkeby: {
  //     url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  //     accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
  //   },
  //   ethereum: {
  //     chainId: 1,
  //     url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
  //     accounts: [`0x${ACCOUNT_PRIVATE_KEY}`]
  //   },
  // },
}
