# 🌐 Deploy to Polygon Amoy Testnet

## Prerequisites

### 1. Get a Testnet Wallet
- **Option A:** Use a separate MetaMask account (recommended)
- **Option B:** Create a new wallet just for testing
- ⚠️ **NEVER use your mainnet wallet with real funds!**

### 2. Export Your Private Key
1. Open MetaMask
2. Click the 3 dots menu → Account Details
3. Click "Export Private Key"
4. Enter your password
5. Copy the private key (starts with 0x)

### 3. Get Testnet MATIC (Free)
You need MATIC to pay for gas fees on deployment.

**Polygon Faucet:**
- Visit: https://faucet.polygon.technology/
- Select "Polygon Amoy"
- Paste your wallet address
- Complete captcha
- Wait 1-2 minutes for MATIC to arrive

**Alternative Faucets:**
- https://www.alchemy.com/faucets/polygon-amoy
- https://amoy-faucet.polygon.technology/

You need at least **0.1 MATIC** for deployment.

---

## Deployment Steps

### Step 1: Configure Environment

Open `contracts/.env` and add your private key:

```env
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
PRIVATE_KEY=0xYOUR_ACTUAL_PRIVATE_KEY_HERE
POLYGONSCAN_API_KEY=
```

**Replace** `0xYOUR_ACTUAL_PRIVATE_KEY_HERE` with your actual private key.

### Step 2: Verify Your Balance

Check you have testnet MATIC:

```powershell
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\contracts
npx hardhat run scripts/check-balance.js --network polygonAmoy
```

### Step 3: Deploy to Testnet

```powershell
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\contracts
npx hardhat run scripts/deploy.js --network polygonAmoy
```

This will:
- Deploy ProposalNFT contract
- Deploy CoupleNFT contract
- Link them together
- Show you the contract addresses
- Update frontend/.env automatically

**Deployment takes 30-60 seconds.** You'll see transaction confirmations.

### Step 4: Update Frontend Configuration

The deployment script should auto-update `frontend/.env`, but verify it has:

```env
VITE_PROPOSAL_NFT_ADDRESS=0x...deployed_address...
VITE_COUPLE_NFT_ADDRESS=0x...deployed_address...
VITE_USE_LOCAL=false
VITE_POLYGON_RPC=https://rpc-amoy.polygon.technology
```

Make sure `VITE_USE_LOCAL=false` for testnet!

### Step 5: Configure MetaMask for Polygon Amoy

1. Open MetaMask
2. Click network dropdown → Add Network → Add Network Manually
3. Enter:
   - **Network Name:** Polygon Amoy Testnet
   - **RPC URL:** https://rpc-amoy.polygon.technology
   - **Chain ID:** 80002
   - **Currency Symbol:** MATIC
   - **Block Explorer:** https://amoy.polygonscan.com/
4. Click "Save"
5. Switch to "Polygon Amoy Testnet"

### Step 6: Start Frontend

```powershell
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\frontend
npm run dev
```

Open http://localhost:5173 and connect your wallet!

---

## 🔍 Verify Deployment

After deployment, you can view your contracts on Polygonscan:

- ProposalNFT: `https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS`
- CoupleNFT: `https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS`

---

## 💰 Cost Estimate

Deployment costs approximately:
- ProposalNFT: ~0.02 MATIC
- CoupleNFT: ~0.02 MATIC
- Linking: ~0.01 MATIC
- **Total: ~0.05 MATIC** (free from faucet!)

---

## 🐛 Troubleshooting

**"Insufficient funds"**
- Get more MATIC from the faucet
- Wait a few minutes for it to arrive

**"Invalid private key"**
- Make sure it starts with 0x
- No spaces or quotes around it
- Check you copied the full key

**"Network error"**
- Check your internet connection
- Try a different RPC: `https://polygon-amoy.g.alchemy.com/v2/demo`

**"Nonce too high"**
- Reset MetaMask: Settings → Advanced → Clear activity tab data

---

## ✅ Success Checklist

- [ ] Private key added to contracts/.env
- [ ] Testnet MATIC received (check MetaMask)
- [ ] Contracts deployed successfully
- [ ] Contract addresses shown in terminal
- [ ] frontend/.env updated with addresses
- [ ] VITE_USE_LOCAL=false in frontend/.env
- [ ] MetaMask connected to Polygon Amoy
- [ ] Frontend running on localhost:5173

---

## 🎉 Next Steps

Once deployed:
1. Share the app with friends to test proposals
2. Each person needs testnet MATIC for transactions
3. Create proposals, accept them, mint SoulBound NFTs!
4. View your NFTs in the Gallery page
5. Check transactions on Polygonscan

---

**Ready to deploy? Follow the steps above!** 🚀
