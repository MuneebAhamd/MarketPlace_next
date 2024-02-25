require("@nomiclabs/hardhat-waffle");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// require('hardhat-ethernal');
const privateKey = "b575aca21b19e5f54bb82b7a9f3684412975de88c198dc4ac4ae70bf97b9f563"

module.exports = {
  networks: {
    Edge: {
      //  url: "http://localhost:10002/",
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      accounts: [privateKey],
    },
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};