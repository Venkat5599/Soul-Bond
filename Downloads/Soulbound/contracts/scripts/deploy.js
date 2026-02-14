const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SoulBound contracts to", hre.network.name);
  console.log("━".repeat(50));

  // Deploy ProposalNFT
  console.log("\n📝 Deploying ProposalNFT...");
  const ProposalNFT = await hre.ethers.getContractFactory("ProposalNFT");
  const proposalNFT = await ProposalNFT.deploy();
  await proposalNFT.waitForDeployment();
  const proposalAddr = await proposalNFT.getAddress();
  console.log("✅ ProposalNFT deployed to:", proposalAddr);

  // Deploy CoupleNFT (SoulBound)
  console.log("\n💖 Deploying CoupleNFT (SoulBound)...");
  const CoupleNFT = await hre.ethers.getContractFactory("CoupleNFT");
  const coupleNFT = await CoupleNFT.deploy();
  await coupleNFT.waitForDeployment();
  const coupleAddr = await coupleNFT.getAddress();
  console.log("✅ CoupleNFT deployed to:", coupleAddr);

  // Link contracts
  console.log("\n🔗 Linking contracts...");
  await proposalNFT.setCoupleNFTContract(coupleAddr);
  console.log("   ProposalNFT → CoupleNFT linked");
  await coupleNFT.setProposalNFTContract(proposalAddr);
  console.log("   CoupleNFT → ProposalNFT linked");

  console.log("\n" + "━".repeat(50));
  console.log("🎉 Deployment complete!\n");
  console.log("Contract Addresses:");
  console.log("  ProposalNFT:", proposalAddr);
  console.log("  CoupleNFT:  ", coupleAddr);
  console.log("\n📋 Save these addresses in your frontend .env file");

  // Save deployment info
  const fs = require("fs");
  const path = require("path");
  const deploymentInfo = {
    network: hre.network.name,
    contracts: {
      ProposalNFT: proposalAddr,
      CoupleNFT: coupleAddr,
    },
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deployment.json");

  // Auto-update frontend .env
  const envPath = path.join(__dirname, "../../frontend/.env");
  try {
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    envContent = envContent.replace(/VITE_PROPOSAL_NFT_ADDRESS=.*/, `VITE_PROPOSAL_NFT_ADDRESS=${proposalAddr}`);
    envContent = envContent.replace(/VITE_COUPLE_NFT_ADDRESS=.*/, `VITE_COUPLE_NFT_ADDRESS=${coupleAddr}`);
    fs.writeFileSync(envPath, envContent);
    console.log("📝 Frontend .env updated with contract addresses");
  } catch (e) {
    console.log("⚠️  Could not auto-update frontend .env:", e.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
