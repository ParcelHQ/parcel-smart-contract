const HDWalletProvider = require('@truffle/hdwallet-provider')
require('dotenv').config()
const package = require('./package')
const mnemonic = process.env.MNEMONIC
const matic_mnemonic = process.env.MATIC_MNEMONIC
const token = process.env.INFURA_TOKEN
const etherscan_api = process.env.ETHERSCAN_KEY

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/' + token)
      },
      network_id: '4',
      gasPrice: 25000000000, // 25 Gwei
    },
    goerli: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://goerli.infura.io/v3/' + token)
      },
      network_id: '5',
      gasPrice: 25000000000, // 25 Gwei
    },
    kovan: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://kovan.infura.io/v3/' + token)
      },
      network_id: '42',
      gasPrice: 25000000000, // 25 Gwei
    },
    mainnet: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/v3/' + token)
      },
      network_id: '1',
      gasPrice: 41000000000, // 41 Gwei
    },
    xdai: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://dai.poa.network')
      },
      network_id: '100',
      gasPrice: 1000000000, // 1 Gwei
    },
    volta: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://volta-rpc.energyweb.org')
      },
      network_id: '73799',
      gasPrice: 1
    },
    ewc: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://rpc.energyweb.org')
      },
      network_id: '246',
      gasPrice: 1
    },
    maticMainnet: {
      provider: () => { 
        return new HDWalletProvider(matic_mnemonic, 'https://rpc-mainnet.maticvigil.com')
      },
      network_id: '137',
      gasPrice: 25000000000, // 25 Gwei
    },
    maticTestnet: {
      provider: () => { 
        return new HDWalletProvider(mnemonic, `https://rpc-mumbai.matic.today`)
      },
      network_id: '80001',
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: package.dependencies.solc,
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999
        }
      }
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: etherscan_api
  }
};
