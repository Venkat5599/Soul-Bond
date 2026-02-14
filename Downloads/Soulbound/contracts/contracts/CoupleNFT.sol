// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CoupleNFT (SoulBound)
 * @dev Non-transferable ERC-721 NFT representing an accepted connection
 * Once minted, this token CANNOT be transferred — it is permanently bound 
 * to the recipient's wallet. This is the "SoulBound" mechanic.
 * 
 * Each couple NFT is minted to BOTH the proposer and the recipient,
 * creating a shared proof of connection on the blockchain.
 */
contract CoupleNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct Connection {
        address person1;
        address person2;
        uint256 timestamp;
        string coupleImageURI;  // IPFS URI of the generated couple image
    }

    // tokenId => Connection
    mapping(uint256 => Connection) public connections;

    // Track connections per address
    mapping(address => uint256[]) public userConnections;

    // Address of the ProposalNFT contract (authorized to mint)
    address public proposalNFTContract;

    // Events
    event ConnectionForged(
        uint256 indexed tokenId1,
        uint256 indexed tokenId2,
        address indexed person1,
        address person2,
        string imageURI
    );

    constructor() ERC721("SoulBound Connection", "SOULBOUND") Ownable(msg.sender) {}

    /**
     * @dev Set the ProposalNFT contract address
     */
    function setProposalNFTContract(address _proposalNFT) external onlyOwner {
        proposalNFTContract = _proposalNFT;
    }

    /**
     * @dev Mint a pair of SoulBound Couple NFTs — one for each person
     * Can only be called by the contract owner or ProposalNFT contract
     * @param person1 First person (proposer)
     * @param person2 Second person (acceptor)
     * @param imageURI IPFS URI of the generated couple image
     * @param metadataURI IPFS URI of the NFT metadata JSON
     */
    function mintCouple(
        address person1,
        address person2,
        string memory imageURI,
        string memory metadataURI
    ) external returns (uint256, uint256) {
        require(
            msg.sender == owner() || msg.sender == proposalNFTContract,
            "Not authorized"
        );
        require(person1 != address(0) && person2 != address(0), "Invalid addresses");

        // Mint NFT for person1
        uint256 tokenId1 = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(person1, tokenId1);
        _setTokenURI(tokenId1, metadataURI);

        // Mint NFT for person2
        uint256 tokenId2 = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(person2, tokenId2);
        _setTokenURI(tokenId2, metadataURI);

        // Store connection data
        Connection memory conn = Connection({
            person1: person1,
            person2: person2,
            timestamp: block.timestamp,
            coupleImageURI: imageURI
        });

        connections[tokenId1] = conn;
        connections[tokenId2] = conn;
        userConnections[person1].push(tokenId1);
        userConnections[person2].push(tokenId2);

        emit ConnectionForged(tokenId1, tokenId2, person1, person2, imageURI);

        return (tokenId1, tokenId2);
    }

    /**
     * @dev SOULBOUND: Override transfer to prevent any transfers
     * This makes the NFT non-transferable (SoulBound)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0)) and burning (to == address(0))
        // Block all other transfers
        if (from != address(0) && to != address(0)) {
            revert("SoulBound: token is non-transferable");
        }

        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Get all connection token IDs for a user
     */
    function getUserConnections(address user) external view returns (uint256[] memory) {
        return userConnections[user];
    }

    /**
     * @dev Get connection details
     */
    function getConnection(uint256 tokenId) external view returns (Connection memory) {
        return connections[tokenId];
    }

    /**
     * @dev Total connections forged
     */
    function totalConnections() external view returns (uint256) {
        return _tokenIdCounter / 2;
    }

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
