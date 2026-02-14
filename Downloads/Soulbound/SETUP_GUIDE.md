# SoulBound - Step-by-Step Setup Guide

## 🚨 IMPORTANT: You need 3 separate terminal windows

---

## Terminal 1: Start Local Blockchain

```powershell
# Navigate to contracts folder
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\contracts

# Start Hardhat local blockchain (this will keep running)
npx hardhat node
```

**Keep this terminal open!** It will show you test accounts with ETH.

---

## Terminal 2: Deploy Contracts

**Wait until Terminal 1 is running**, then open a NEW terminal:

```powershell
# Navigate to contracts folder
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\contracts

# Deploy contracts to local network
npx hardhat run scripts/deploy.js --network localhost
```

This will:
- Deploy ProposalNFT and CoupleNFT contracts
- Link them together
- Auto-create `frontend/.env` with contract addresses
- Show you the deployed contract addresses

---

## Terminal 3: Install Frontend & Start Dev Server

Open a NEW terminal:

```powershell
# Navigate to frontend folder
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\frontend

# Install dependencies (only needed once)
npm install

# Start the development server
npm run dev
```

The app will open at: http://localhost:5173

---

## 🦊 MetaMask Setup

1. Open MetaMask extension
2. Click network dropdown → Add Network → Add Network Manually
3. Enter these details:
   - **Network Name:** Hardhat Local
   - **RPC URL:** http://127.0.0.1:8545
   - **Chain ID:** 31337
   - **Currency Symbol:** ETH
4. Click "Save"

5. Import a test account:
   - Copy a private key from Terminal 1 (the Hardhat node output)
   - MetaMask → Account menu → Import Account
   - Paste the private key
   - You'll have 10,000 test ETH!

---

## ✅ Testing the App

1. Open http://localhost:5173
2. Click "Connect Wallet" in the navbar
3. Approve MetaMask connection
4. Go to "Propose" page
5. Fill in the form and create a proposal
6. Switch to the recipient's account in MetaMask
7. Go to "Inbox" to see and accept the proposal
8. Check "Gallery" to see your SoulBound NFT!

---

## 🐛 Troubleshooting

**"Cannot find path contracts"**
- You're in the wrong folder. Use the FULL path in the commands above.

**"No Hardhat config file found"**
- You're in the frontend folder. Navigate to the contracts folder first.

**"Frontend dependencies not installed"**
- Run `npm install` in the frontend folder.

**MetaMask shows wrong network**
- Make sure you're on "Hardhat Local" network in MetaMask.

**Transaction fails**
- Reset MetaMask account: Settings → Advanced → Clear activity tab data

---

## 📁 Quick Reference

Your project structure:
```
C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\
├── contracts/          ← Terminal 1 & 2 work here
│   ├── contracts/
│   ├── scripts/
│   └── hardhat.config.js
└── frontend/           ← Terminal 3 works here
    ├── src/
    └── package.json
```

---

## 🎯 Summary

1. **Terminal 1:** `cd contracts` → `npx hardhat node` (keep running)
2. **Terminal 2:** `cd contracts` → `npx hardhat run scripts/deploy.js --network localhost`
3. **Terminal 3:** `cd frontend` → `npm install` → `npm run dev`
4. **Browser:** Open http://localhost:5173
5. **MetaMask:** Connect to Hardhat Local (127.0.0.1:8545, Chain ID 31337)

---

**Need help? Just ask!** 🚀
