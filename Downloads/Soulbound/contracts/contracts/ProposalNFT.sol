// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interface for CoupleNFT cross-contract call
interface ICoupleNFT {
    function mintCouple(
        address person1,
        address person2,
        string memory imageURI,
        string memory metadataURI
    ) external returns (uint256, uint256);
}

/**
 * @title ProposalNFT
 * @dev ERC-721 NFT representing a connection proposal
 * When a user proposes a connection, this NFT is minted and sent to the recipient
 * The recipient can then accept (triggering CoupleNFT mint) or reject (burning this NFT)
 */
contract ProposalNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    // Proposal status
    enum ProposalStatus { Pending, Accepted, Rejected, Expired }

    struct Proposal {
        address proposer;
        address recipient;
        string message;
        string senderName;
        string receiverName;
        uint256 timestamp;
        ProposalStatus status;
    }

    // tokenId => Proposal
    mapping(uint256 => Proposal) public proposals;

    // recipient address => list of proposal token IDs
    mapping(address => uint256[]) public recipientProposals;

    // Address of the CoupleNFT contract (set after deployment)
    address public coupleNFTContract;

    // Events
    event ProposalCreated(uint256 indexed tokenId, address indexed proposer, address indexed recipient);
    event ProposalAccepted(uint256 indexed tokenId, address indexed proposer, address indexed recipient);
    event ProposalRejected(uint256 indexed tokenId);

    constructor() ERC721("SoulBound Proposal", "SBPROPOSAL") Ownable(msg.sender) {}

    /**
     * @dev Set the CoupleNFT contract address (called once after both contracts are deployed)
     */
    function setCoupleNFTContract(address _coupleNFT) external onlyOwner {
        coupleNFTContract = _coupleNFT;
    }

    /**
     * @dev Create a new proposal NFT and send it to the recipient
     * @param recipient The wallet address of the person being proposed to
     * @param message A personal message included with the proposal
     * @param senderName Display name of the proposer
     * @param receiverName Display name of the recipient
     * @param uri The metadata URI (IPFS link)
     */
    function createProposal(
        address recipient,
        string memory message,
        string memory senderName,
        string memory receiverName,
        string memory uri
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(recipient != msg.sender, "Cannot propose to yourself");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);

        proposals[tokenId] = Proposal({
            proposer: msg.sender,
            recipient: recipient,
            message: message,
            senderName: senderName,
            receiverName: receiverName,
            timestamp: block.timestamp,
            status: ProposalStatus.Pending
        });

        recipientProposals[recipient].push(tokenId);

        emit ProposalCreated(tokenId, msg.sender, recipient);
        return tokenId;
    }

    /**
     * @dev Accept a proposal — only the recipient (current holder) can accept
     * This will burn the proposal NFT and trigger CoupleNFT minting
     * @param tokenId The proposal token ID
     * @param coupleImageURI IPFS URI of the generated couple image
     * @param coupleMetadataURI IPFS URI of the couple NFT metadata JSON
     */
    function acceptProposal(
        uint256 tokenId,
        string memory coupleImageURI,
        string memory coupleMetadataURI
    ) external {
        require(ownerOf(tokenId) == msg.sender, "Not the recipient");
        require(proposals[tokenId].status == ProposalStatus.Pending, "Not pending");
        require(coupleNFTContract != address(0), "CoupleNFT not linked");

        proposals[tokenId].status = ProposalStatus.Accepted;

        // Burn the proposal NFT
        _burn(tokenId);

        // Auto-mint the SoulBound Couple NFTs for both parties
        ICoupleNFT(coupleNFTContract).mintCouple(
            proposals[tokenId].proposer,
            msg.sender,
            coupleImageURI,
            coupleMetadataURI
        );

        emit ProposalAccepted(tokenId, proposals[tokenId].proposer, msg.sender);
    }

    /**
     * @dev Reject a proposal — only the recipient can reject
     */
    function rejectProposal(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not the recipient");
        require(proposals[tokenId].status == ProposalStatus.Pending, "Not pending");

        proposals[tokenId].status = ProposalStatus.Rejected;

        // Burn the proposal NFT
        _burn(tokenId);

        emit ProposalRejected(tokenId);
    }

    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 tokenId) external view returns (Proposal memory) {
        return proposals[tokenId];
    }

    /**
     * @dev Get total proposals created
     */
    function totalProposals() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Get all proposal IDs for a recipient
     */
    function getRecipientProposals(address recipient) external view returns (uint256[] memory) {
        return recipientProposals[recipient];
    }

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
