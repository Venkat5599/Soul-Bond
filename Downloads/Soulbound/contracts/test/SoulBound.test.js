const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SoulBound Contracts", function () {
  let proposalNFT, coupleNFT;
  let owner, proposer, recipient;

  beforeEach(async function () {
    [owner, proposer, recipient] = await ethers.getSigners();

    // Deploy contracts
    const ProposalNFT = await ethers.getContractFactory("ProposalNFT");
    proposalNFT = await ProposalNFT.deploy();

    const CoupleNFT = await ethers.getContractFactory("CoupleNFT");
    coupleNFT = await CoupleNFT.deploy();

    // Link contracts
    await proposalNFT.setCoupleNFTContract(await coupleNFT.getAddress());
    await coupleNFT.setProposalNFTContract(await proposalNFT.getAddress());
  });

  describe("ProposalNFT", function () {
    it("Should create a proposal with names", async function () {
      const tx = await proposalNFT
        .connect(proposer)
        .createProposal(recipient.address, "Will you be my SoulBound?", "Alice", "Bob", "ipfs://test");
      await tx.wait();

      const proposal = await proposalNFT.getProposal(0);
      expect(proposal.proposer).to.equal(proposer.address);
      expect(proposal.recipient).to.equal(recipient.address);
      expect(proposal.message).to.equal("Will you be my SoulBound?");
      expect(proposal.senderName).to.equal("Alice");
      expect(proposal.receiverName).to.equal("Bob");
      expect(proposal.status).to.equal(0); // Pending
    });

    it("Should not allow self-proposals", async function () {
      await expect(
        proposalNFT.connect(proposer).createProposal(proposer.address, "test", "A", "B", "ipfs://test")
      ).to.be.revertedWith("Cannot propose to yourself");
    });

    it("Should track recipient proposals", async function () {
      await proposalNFT.connect(proposer).createProposal(recipient.address, "test", "A", "B", "ipfs://test");
      
      const recipientProposals = await proposalNFT.getRecipientProposals(recipient.address);
      expect(recipientProposals.length).to.equal(1);
      expect(recipientProposals[0]).to.equal(0);
    });

    it("Should accept and auto-mint CoupleNFT", async function () {
      await proposalNFT
        .connect(proposer)
        .createProposal(recipient.address, "test", "Alice", "Bob", "ipfs://test");

      // Accept the proposal (should auto-mint CoupleNFT)
      await proposalNFT.connect(recipient).acceptProposal(0, "ipfs://couple-image", "ipfs://couple-meta");

      // Check proposal status
      const proposal = await proposalNFT.getProposal(0);
      expect(proposal.status).to.equal(1); // Accepted

      // Check CoupleNFT was auto-minted
      expect(await coupleNFT.ownerOf(0)).to.equal(proposer.address);
      expect(await coupleNFT.ownerOf(1)).to.equal(recipient.address);

      const conn = await coupleNFT.getConnection(0);
      expect(conn.person1).to.equal(proposer.address);
      expect(conn.person2).to.equal(recipient.address);
      expect(conn.coupleImageURI).to.equal("ipfs://couple-image");
    });

    it("Should allow recipient to reject", async function () {
      await proposalNFT
        .connect(proposer)
        .createProposal(recipient.address, "test", "A", "B", "ipfs://test");

      await proposalNFT.connect(recipient).rejectProposal(0);

      const proposal = await proposalNFT.getProposal(0);
      expect(proposal.status).to.equal(2); // Rejected
    });

    it("Should not allow non-recipient to accept", async function () {
      await proposalNFT
        .connect(proposer)
        .createProposal(recipient.address, "test", "A", "B", "ipfs://test");

      await expect(
        proposalNFT.connect(proposer).acceptProposal(0, "ipfs://img", "ipfs://meta")
      ).to.be.revertedWith("Not the recipient");
    });
  });

  describe("CoupleNFT (SoulBound)", function () {
    it("Should mint a couple NFT pair", async function () {
      await coupleNFT.mintCouple(
        proposer.address,
        recipient.address,
        "ipfs://couple-image",
        "ipfs://metadata"
      );

      expect(await coupleNFT.ownerOf(0)).to.equal(proposer.address);
      expect(await coupleNFT.ownerOf(1)).to.equal(recipient.address);

      const conn = await coupleNFT.getConnection(0);
      expect(conn.person1).to.equal(proposer.address);
      expect(conn.person2).to.equal(recipient.address);
    });

    it("Should be non-transferable (SoulBound)", async function () {
      await coupleNFT.mintCouple(
        proposer.address,
        recipient.address,
        "ipfs://couple-image",
        "ipfs://metadata"
      );

      await expect(
        coupleNFT.connect(proposer).transferFrom(proposer.address, recipient.address, 0)
      ).to.be.revertedWith("SoulBound: token is non-transferable");
    });

    it("Should track user connections", async function () {
      await coupleNFT.mintCouple(
        proposer.address,
        recipient.address,
        "ipfs://image1",
        "ipfs://meta1"
      );

      const connections = await coupleNFT.getUserConnections(proposer.address);
      expect(connections.length).to.equal(1);
      expect(connections[0]).to.equal(0);
    });

    it("Should count total connections", async function () {
      await coupleNFT.mintCouple(
        proposer.address,
        recipient.address,
        "ipfs://image1",
        "ipfs://meta1"
      );

      expect(await coupleNFT.totalConnections()).to.equal(1);
    });

    it("Full end-to-end flow: propose → accept → SoulBound minted", async function () {
      // 1. Create proposal
      await proposalNFT.connect(proposer).createProposal(
        recipient.address, "Forever SoulBound", "Alice", "Bob", "ipfs://proposal-meta"
      );
      expect(await proposalNFT.totalProposals()).to.equal(1);

      // 2. Accept proposal (auto-mints couple NFT)
      await proposalNFT.connect(recipient).acceptProposal(0, "ipfs://couple-image", "ipfs://couple-meta");

      // 3. Verify CoupleNFT exists and is SoulBound
      expect(await coupleNFT.totalConnections()).to.equal(1);
      expect(await coupleNFT.ownerOf(0)).to.equal(proposer.address);
      expect(await coupleNFT.ownerOf(1)).to.equal(recipient.address);

      // 4. Verify non-transferable
      await expect(
        coupleNFT.connect(proposer).transferFrom(proposer.address, recipient.address, 0)
      ).to.be.revertedWith("SoulBound: token is non-transferable");
    });
  });
});
