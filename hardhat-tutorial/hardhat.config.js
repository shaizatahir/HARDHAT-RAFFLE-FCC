// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-contract-sizer");
require("dotenv").config();

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    mumbai: {
      chainId: 80001,
      blockConfirmation: 6,
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  solidity: "0.8.17",
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
    player: {
      default: 1,
    },
  },
  mocha: {
    timeout: 500000, // 500 seconds max for running tests
  },
  version: "0.8.8",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
