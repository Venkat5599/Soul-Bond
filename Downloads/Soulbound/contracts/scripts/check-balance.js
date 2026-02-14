const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const address = await deployer.getAddress();
  const balance = await hre.ethers.provider.getBalance(address);
  
  console.log("━".repeat(50));
  console.log("💰 Wallet Balance Check");
  console.log("━".repeat(50));
  console.log("Address:", address);
  console.log("Balance:", hre.ethers.formatEther(balance), "MATIC");
  console.log("━".repeat(50));
  
  if (balance === 0n) {
    console.log("❌ No MATIC found!");
    console.log("\n📝 To get testnet MATIC:");
    console.log("1. Visit: https://faucet.polygon.technology/");
    console.log("2. Select 'Polygon Amoy'");
    console.log("3. Enter your address:", address);
    console.log("4. Wait 2-3 minutes");
  } else {
    console.log("✅ You have MATIC! Ready to deploy.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
