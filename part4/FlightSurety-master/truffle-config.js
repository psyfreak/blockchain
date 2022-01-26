var HDWalletProvider = require("truffle-hdwallet-provider"),
  mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat",
  infuraRinkeby = "https://rinkeby.infura.io/v3/supersecret";

// Be sure to match this mnemonic with that in Ganache!
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,
      network_id: '*',
      websockets: true
      // gas cost per default 0
    },
    devHd: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,
      network_id: '*',
      provider: () => new HDWalletProvider(mnemonic, "http://127.0.0.1:7545/", 0, 50),
    },
    dev2: {
      //provider: () => new HDWalletProvider(mnemonic, infuraRinkeby),
      //provider: () => new HDWalletProvider(mnemonic, "http://127.0.0.1:7545/", 0, 10),
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,
      network_id: '*',
      gas: 9999999
    }
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};