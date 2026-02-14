# 🌍 How Others Can Use Your SoulBound App

## Option 1: Local Development (Testing with Friends)

### Your Setup:
1. Deploy contracts to Polygon Amoy testnet
2. Run frontend locally: `npm run dev`
3. Use a tool like **ngrok** to expose your local server

### Using ngrok (Free):
```powershell
# Install ngrok
# Download from: https://ngrok.com/download

# Run in a new terminal
ngrok http 5173
```

This gives you a public URL like: `https://abc123.ngrok.io`

Share this URL with friends! They can:
- Open the URL in their browser
- Connect their MetaMask (must be on Polygon Amoy)
- Need testnet MATIC from faucet
- Create proposals and interact with your contracts

**Limitations:**
- Your computer must stay on
- URL changes when you restart ngrok (free tier)
- Only works while your dev server is running

---

## Option 2: Deploy Frontend to Hosting (Production)

### Best Options:

### A. Vercel (Recommended - Free & Easy)

1. **Push code to GitHub:**
```powershell
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/soulbound.git
git push -u origin main
```

2. **Deploy on Vercel:**
- Visit: https://vercel.com
- Sign up with GitHub
- Click "New Project"
- Import your repository
- Configure:
  - **Root Directory:** `frontend`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
- Add Environment Variables:
  ```
  VITE_PROPOSAL_NFT_ADDRESS=0xYourDeployedAddress
  VITE_COUPLE_NFT_ADDRESS=0xYourDeployedAddress
  VITE_USE_LOCAL=false
  VITE_POLYGON_RPC=https://rpc-amoy.polygon.technology
  ```
- Click "Deploy"

**Result:** You get a URL like `https://soulbound.vercel.app`

### B. Netlify (Alternative - Also Free)

1. Build your frontend:
```powershell
cd frontend
npm run build
```

2. Deploy to Netlify:
- Visit: https://netlify.com
- Drag & drop the `frontend/dist` folder
- Configure environment variables in site settings

### C. GitHub Pages (Free)

1. Build frontend:
```powershell
cd frontend
npm run build
```

2. Install gh-pages:
```powershell
npm install --save-dev gh-pages
```

3. Add to `frontend/package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/soulbound"
}
```

4. Deploy:
```powershell
npm run deploy
```

---

## What Users Need:

### For Anyone to Use Your App:

1. **MetaMask Installed**
   - Browser extension from metamask.io

2. **Polygon Amoy Network Added**
   - Network Name: Polygon Amoy Testnet
   - RPC URL: https://rpc-amoy.polygon.technology
   - Chain ID: 80002
   - Currency: MATIC
   - Explorer: https://amoy.polygonscan.com

3. **Testnet MATIC (Free)**
   - Get from: https://faucet.polygon.technology/
   - Need ~0.01 MATIC per transaction
   - Completely free from faucet

4. **Your App URL**
   - Either ngrok URL (temporary)
   - Or hosted URL (permanent)

---

## User Flow Example:

### Alice wants to propose to Bob:

1. **Alice:**
   - Opens your app URL
   - Connects MetaMask (Polygon Amoy network)
   - Goes to "Propose" page
   - Uploads her avatar
   - Enters Bob's wallet address: `0xBob...`
   - Writes message: "Be my SoulBound partner!"
   - Clicks "Create Proposal"
   - Pays ~0.01 MATIC gas fee
   - Transaction confirmed! ✅

2. **Bob:**
   - Opens your app URL
   - Connects his MetaMask
   - Goes to "Inbox" page
   - Sees Alice's proposal
   - Clicks "Accept"
   - Beautiful couple image generates
   - Pays ~0.02 MATIC gas fee
   - Both receive SoulBound NFTs! 💖

3. **Both can:**
   - View their NFTs in "Gallery"
   - See them in MetaMask (add NFT with contract address)
   - View on Polygonscan
   - NFTs are non-transferable (SoulBound!)

---

## Sharing Instructions for Users:

Create a simple guide for your users:

```markdown
# How to Use SoulBound

1. Install MetaMask: https://metamask.io
2. Add Polygon Amoy network (see settings below)
3. Get free testnet MATIC: https://faucet.polygon.technology/
4. Visit: [YOUR_APP_URL]
5. Connect wallet and start creating proposals!

## Network Settings:
- Network: Polygon Amoy Testnet
- RPC: https://rpc-amoy.polygon.technology
- Chain ID: 80002
- Symbol: MATIC

## Need Help?
- Each transaction costs ~0.01 MATIC (free from faucet)
- Proposals are sent to recipient's wallet address
- SoulBound NFTs cannot be transferred or sold
- Check your NFTs in the Gallery page
```

---

## Production Deployment (Mainnet)

⚠️ **Before deploying to mainnet:**

1. **Security Audit**
   - Get contracts audited by professionals
   - Cost: $5,000 - $50,000

2. **Deploy to Polygon Mainnet**
   - Change network in hardhat.config.js
   - Use real MATIC (costs ~$0.50 to deploy)
   - Update frontend .env with mainnet addresses

3. **Users need real MATIC**
   - Buy from exchanges (Coinbase, Binance)
   - Bridge from Ethereum
   - Each transaction costs ~$0.01

4. **Legal Considerations**
   - Terms of service
   - Privacy policy
   - Compliance with local laws

---

## Quick Recommendation:

**For Testing (Now):**
- Deploy contracts to Polygon Amoy ✅
- Use ngrok to share with friends
- Everyone uses testnet MATIC (free)

**For Public Launch (Later):**
- Deploy frontend to Vercel (free, permanent URL)
- Keep using Polygon Amoy testnet
- Share URL on social media

**For Production (Future):**
- Get security audit
- Deploy to Polygon mainnet
- Use custom domain
- Market your app!

---

## Cost Summary:

| Stage | Your Cost | User Cost |
|-------|-----------|-----------|
| **Testnet** | Free | Free (testnet MATIC) |
| **Hosting** | Free (Vercel) | Free (testnet MATIC) |
| **Mainnet** | ~$0.50 deploy | ~$0.01 per transaction |

---

**Ready to share? Deploy to testnet first, then use ngrok or Vercel!** 🚀
