# 🦊 How to Create a Testnet-Only Wallet in MetaMask

## Why You Need a Separate Wallet

⚠️ **NEVER use your main wallet (with real money) for testing!**

If you accidentally expose your private key or make a mistake, you could lose real funds. A testnet wallet keeps you safe.

---

## Method 1: Create New Account in MetaMask (Easiest)

### Step 1: Open MetaMask
Click the MetaMask extension in your browser

### Step 2: Create New Account
1. Click the **account icon** (circle) at the top right
2. Click **"Add account or hardware wallet"**
3. Click **"Add a new account"**
4. Name it: **"Testnet Only"** or **"Development"**
5. Click **"Create"**

✅ Done! You now have a new account with address `0x...`

### Step 3: Get the Private Key
1. Click the **3 dots (⋮)** next to "Testnet Only" account
2. Click **"Account Details"**
3. Click **"Export Private Key"**
4. Enter your MetaMask password
5. **Copy the private key** (starts with 0x)
6. Paste it in `contracts/.env`

### Step 4: Get Free Testnet MATIC
1. Copy your new wallet address (click on it to copy)
2. Visit: https://faucet.polygon.technology/
3. Select "Polygon Amoy"
4. Paste your address
5. Complete captcha
6. Wait 1-2 minutes for MATIC to arrive

---

## Method 2: Create Completely New MetaMask Wallet (More Secure)

### Step 1: Create New Browser Profile
**Chrome/Edge:**
1. Click your profile icon (top right)
2. Click "Add"
3. Click "Continue without an account"
4. Name it "Development"

**Firefox:**
1. Type `about:profiles` in address bar
2. Click "Create a New Profile"
3. Name it "Development"

### Step 2: Install MetaMask in New Profile
1. Switch to your new browser profile
2. Install MetaMask: https://metamask.io/download/
3. Click "Create a new wallet"
4. Create a new password (can be simple for testing)
5. **Save the Secret Recovery Phrase** (12 words) somewhere safe
6. Complete setup

✅ This wallet is completely separate from your main wallet!

### Step 3: Export Private Key
1. Click MetaMask icon
2. Click 3 dots → Account Details
3. Export Private Key
4. Copy and paste in `contracts/.env`

---

## Quick Comparison

| Method | Pros | Cons |
|--------|------|------|
| **New Account** | Fast, easy, same MetaMask | Shares same seed phrase |
| **New Profile** | Completely separate | Takes more time to set up |

**Recommendation:** Use Method 1 (New Account) for quick testing. It's safe enough for testnets.

---

## Your Setup Checklist

- [ ] Created new account named "Testnet Only"
- [ ] Copied the new wallet address
- [ ] Got testnet MATIC from faucet
- [ ] Exported private key
- [ ] Pasted private key in `contracts/.env`
- [ ] Saved the file

---

## Example contracts/.env

After you paste your private key, it should look like:

```env
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
POLYGONSCAN_API_KEY=
```

(This is a fake key - use your real one!)

---

## Safety Tips

✅ **DO:**
- Use separate account for testing
- Keep testnet and mainnet accounts clearly labeled
- Only put testnet MATIC in testnet wallet

❌ **DON'T:**
- Send real money to testnet wallet
- Share your private key with anyone
- Use mainnet wallet for development
- Commit .env file to GitHub (it's in .gitignore)

---

## Ready to Deploy?

Once you have:
1. ✅ New testnet account created
2. ✅ Testnet MATIC received
3. ✅ Private key in contracts/.env

Run:
```powershell
cd C:\Users\ksubh\OneDrive\Documents\SoulBond\Downloads\Soulbound\contracts
npx hardhat run scripts/deploy.js --network polygonAmoy
```

🚀 Let's deploy!
