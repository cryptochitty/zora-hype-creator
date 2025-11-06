// Fix: Use ES module import for ethers, which is standard for TypeScript-based Hardhat projects.
// This resolves the "Cannot find name 'require'" error.
import { ethers } from "hardhat";

async function main() {
  // --- IMPORTANT: FILL THIS VALUE BEFORE DEPLOYING THE FACTORY ---
  const platformFeeCollector = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Your platform's fee collection address (using deployer for example)
  // --- END OF VALUES TO FILL ---

  console.log("Deploying CampaignFactory contract...");

  const CampaignFactory = await ethers.getContractFactory("CampaignFactory");
  const factory = await CampaignFactory.deploy(platformFeeCollector);

  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log(`CampaignFactory deployed to: ${factoryAddress}`);
  console.log("----------------------------------------------------");
  console.log("Next steps:");
  console.log(`1. Verify contract on Etherscan (if applicable).`);
  console.log(`2. Update your frontend application's constants file with this contract address: ${factoryAddress}`);
  console.log("----------------------------------------------------");
}

main().catch((error) => {
  console.error(error);
  // Fix: Use `process.exitCode` instead of `process.exit()` to signal an error.
  // This avoids a TypeScript error when Node.js types are not properly resolved.
  process.exitCode = 1;
});