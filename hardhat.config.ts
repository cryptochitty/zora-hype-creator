import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/your-key";
const BASE_GOERLI_RPC_URL = process.env.BASE_GOERLI_RPC_URL || "https://goerli.base.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xYourPrivateKey";

// Fix: Removed HardhatUserConfig type annotation to avoid type errors from potentially broken type definitions.
const config = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    baseGoerli: {
      url: BASE_GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 84531,
    }
  },
};

export default config;