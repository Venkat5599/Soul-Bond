# ✅ Blockchain Running! Next Steps:

## Terminal 1 Status: ✅ RUNNING
Your Hardhat local blockchain is active with 20 test accounts (10,000 ETH each)

---

## Step 2: Deploy Contracts (NEW Terminal)

Open a **NEW terminal window** and run:

```powershell
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\contracts
npx hardhat run scripts/deploy.js --network localhost
```

This will deploy your smart contracts and show you the addresses.

---

## Step 3: Install Frontend Dependencies (NEW Terminal)

Open **ANOTHER new terminal** and run:

```powershell
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\frontend
npm install
```

Wait for it to finish, then:

```powershell
npm run dev
```

---

## Step 4: Setup MetaMask

1. Open MetaMask extension
2. Add Hardhat Local network:
   - Network Name: **Hardhat Local**
   - RPC URL: **http://127.0.0.1:8545**
   - Chain ID: **31337**
   - Currency: **ETH**

3. Import a test account (use any private key from Terminal 1):
   - Example: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
   - MetaMask → Import Account → Paste private key
   - You'll have 10,000 test ETH!

---

## 🎯 Summary

- ✅ Terminal 1: Blockchain running (KEEP IT OPEN)
- ⏳ Terminal 2: Deploy contracts (do this next)
- ⏳ Terminal 3: Start frontend (after deployment)
- ⏳ Browser: Open http://localhost:5173
- ⏳ MetaMask: Connect to Hardhat Local

---

**Keep Terminal 1 running and proceed to Terminal 2!**
