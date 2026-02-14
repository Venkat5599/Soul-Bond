# SoulBound — Proposal NFTs

> **Forge immutable, non-transferable bonds on the blockchain.**

SoulBound is a decentralized application that lets users propose digital connections to each other. When a proposal is accepted, a unique couple image is generated and minted as a **non-transferable (SoulBound) NFT** on the Polygon blockchain — permanent proof of your connection.

## How It Works

```
1. Connect Wallet    → MetaMask on Polygon Amoy Testnet
2. Create Proposal   → Upload avatars, write a message, enter recipient wallet
3. Mint Proposal NFT → ERC-721 minted to the recipient's wallet
4. Recipient Accepts  → Unique couple image generated on canvas
5. SoulBound Minted  → Non-transferable NFT pair minted to BOTH wallets
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Vite + Tailwind CSS + Framer Motion |
| **Smart Contracts** | Solidity 0.8.20 + Hardhat + OpenZeppelin 5 |
| **Blockchain** | Polygon Amoy Testnet (EVM) |
| **Web3** | ethers.js 6 + MetaMask |
| **IPFS** | Pinata (with data URL fallback) |
| **Image Gen** | HTML Canvas API |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                    Frontend                      │
│  React + Vite + Tailwind + Framer Motion         │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Proposal │  │  Inbox   │  │   Gallery    │   │
│  │  Create  │  │ (Accept/ │  │ (SoulBound   │   │
│  │          │  │  Reject) │  │  NFTs)       │   │
│  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │              │               │            │
│  ┌────┴──────────────┴───────────────┴────────┐  │
│  │         Contract Service (ethers.js)        │  │
│  └────────────────────┬───────────────────────┘  │
│                       │                           │
│  ┌────────────────────┴───────────────────────┐  │
│  │          IPFS Service (Pinata)              │  │
│  └────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────┘
                        │
┌───────────────────────┴───────────────────────────┐
│              Polygon Amoy Testnet                  │
│                                                     │
│  ┌──────────────┐        ┌──────────────────┐      │
│  │ ProposalNFT  │───────▶│   CoupleNFT      │      │
│  │   (ERC-721)  │ auto-  │ (SoulBound/ERC-721│      │
│  │              │ mint   │  non-transferable) │      │
│  └──────────────┘        └──────────────────┘      │
└─────────────────────────────────────────────────────┘
```

## Smart Contracts

### ProposalNFT
- Creates ERC-721 proposal tokens minted to recipients
- Stores proposal metadata: names, message, timestamp
- On accept: burns proposal + auto-mints CoupleNFT pair
- On reject: burns proposal token
- Tracks proposals by recipient address

### CoupleNFT (SoulBound)
- Non-transferable ERC-721 — overrides `_update()` to block transfers
- Mints a pair (one per person) when a proposal is accepted
- Stores connection data: both addresses, timestamp, image URI
- Tracks connections per user

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension

### 1. Clone & Install

```bash
git clone <repo-url> && cd Soulbound

# Install contract dependencies
cd contracts && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Local Development (Hardhat)

```bash
# Terminal 1: Start local blockchain
cd contracts && npx hardhat node

# Terminal 2: Deploy contracts
cd contracts && npx hardhat run scripts/deploy.js --network localhost
# ↑ This auto-updates frontend/.env with contract addresses

# Terminal 3: Start frontend
cd frontend && npm run dev
```

Open http://localhost:5173 and connect MetaMask to `localhost:8545`.

### 3. Deploy to Polygon Amoy Testnet

```bash
# Create contracts/.env
cp contracts/.env.example contracts/.env
# Add your PRIVATE_KEY (wallet with testnet MATIC)

# Deploy
cd contracts && npx hardhat run scripts/deploy.js --network polygonAmoy

# Update frontend/.env
# Set VITE_USE_LOCAL=false
# Contract addresses auto-populated by deploy script
```

### 4. IPFS Setup (Optional)

1. Create free account at [pinata.cloud](https://pinata.cloud)
2. Get JWT token from API Keys section
3. Add to `frontend/.env`:
   ```
   VITE_PINATA_JWT=your_jwt_token
   ```

Without Pinata, images are stored as data URLs (works for demo).

## Project Structure

```
Soulbound/
├── contracts/
│   ├── contracts/
│   │   ├── ProposalNFT.sol      # Proposal token contract
│   │   └── CoupleNFT.sol        # SoulBound couple contract
│   ├── scripts/deploy.js        # Deployment script
│   ├── test/SoulBound.test.js   # 11 test cases
│   └── hardhat.config.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx             # Landing hero
│   │   │   ├── Navbar.jsx           # Glass pill navbar
│   │   │   ├── ProposalCreate.jsx   # Proposal form → blockchain
│   │   │   ├── ProposalInbox.jsx    # Accept/reject → blockchain
│   │   │   └── CanvasGenerator.jsx  # Couple NFT image generator
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Home page
│   │   │   ├── Propose.jsx          # Create proposal page
│   │   │   ├── Inbox.jsx            # View proposals page
│   │   │   ├── Gallery.jsx          # SoulBound NFTs gallery
│   │   │   └── Manifesto.jsx        # Project vision
│   │   ├── services/
│   │   │   ├── contractService.js   # ethers.js contract interactions
│   │   │   └── ipfsService.js       # Pinata IPFS uploads
│   │   ├── context/
│   │   │   ├── Web3Context.jsx      # MetaMask wallet provider
│   │   │   └── ThemeContext.jsx      # Dark/light theme
│   │   └── contracts/
│   │       └── abi.json             # Contract ABIs
│   └── .env
└── README.md
```

## Testing

```bash
cd contracts && npx hardhat test
```

```
  SoulBound Contracts
    ProposalNFT
      ✔ Should create a proposal with names
      ✔ Should not allow self-proposals
      ✔ Should track recipient proposals
      ✔ Should accept and auto-mint CoupleNFT
      ✔ Should allow recipient to reject
      ✔ Should not allow non-recipient to accept
    CoupleNFT (SoulBound)
      ✔ Should mint a couple NFT pair
      ✔ Should be non-transferable (SoulBound)
      ✔ Should track user connections
      ✔ Should count total connections
      ✔ Full end-to-end flow: propose → accept → SoulBound minted

  11 passing
```

## Key Features

- **SoulBound (Non-Transferable)**: Couple NFTs cannot be sold, traded or transferred
- **On-Chain Proposals**: Every proposal is an ERC-721 minted to the recipient
- **Auto-Mint on Accept**: Accepting burns the proposal and auto-mints paired CoupleNFTs
- **Canvas Image Generation**: Unique 800x800 couple art with avatars, glow effects, particles
- **IPFS Storage**: Images and metadata stored on IPFS via Pinata
- **Dark/Light Theme**: Full theme toggle with localStorage persistence
- **Wallet-Scoped Inbox**: Proposals filtered by connected wallet address
- **Real Transaction Hashes**: Every action produces a verifiable on-chain transaction

## License

MIT
