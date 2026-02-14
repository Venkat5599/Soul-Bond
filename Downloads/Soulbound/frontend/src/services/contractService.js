import { ethers } from 'ethers'
import contractData from '../contracts/abi.json'

const PROPOSAL_NFT_ADDRESS = import.meta.env.VITE_PROPOSAL_NFT_ADDRESS
const COUPLE_NFT_ADDRESS = import.meta.env.VITE_COUPLE_NFT_ADDRESS

/**
 * Get contract instances connected to a signer
 */
export function getProposalContract(signer) {
  return new ethers.Contract(PROPOSAL_NFT_ADDRESS, contractData.ProposalNFT.abi, signer)
}

export function getCoupleContract(signerOrProvider) {
  return new ethers.Contract(COUPLE_NFT_ADDRESS, contractData.CoupleNFT.abi, signerOrProvider)
}

/**
 * Create a proposal NFT on-chain
 */
export async function createProposalOnChain(signer, { recipient, message, senderName, receiverName, metadataURI }) {
  const contract = getProposalContract(signer)
  const tx = await contract.createProposal(recipient, message, senderName, receiverName, metadataURI)
  const receipt = await tx.wait()

  // Extract tokenId from ProposalCreated event
  const event = receipt.logs.find(log => {
    try {
      return contract.interface.parseLog(log)?.name === 'ProposalCreated'
    } catch { return false }
  })

  const parsed = event ? contract.interface.parseLog(event) : null
  return {
    txHash: receipt.hash,
    tokenId: parsed ? parsed.args.tokenId.toString() : null,
    receipt
  }
}

/**
 * Get all proposals for a recipient address
 */
export async function getProposalsForRecipient(signerOrProvider, recipientAddress) {
  const contract = new ethers.Contract(PROPOSAL_NFT_ADDRESS, contractData.ProposalNFT.abi, signerOrProvider)

  try {
    const tokenIds = await contract.getRecipientProposals(recipientAddress)
    const proposals = []

    for (const tokenId of tokenIds) {
      try {
        const proposal = await contract.getProposal(tokenId)
        proposals.push({
          tokenId: tokenId.toString(),
          proposer: proposal.proposer,
          recipient: proposal.recipient,
          message: proposal.message,
          senderName: proposal.senderName,
          receiverName: proposal.receiverName,
          timestamp: Number(proposal.timestamp) * 1000,
          status: ['pending', 'accepted', 'rejected', 'expired'][proposal.status]
        })
      } catch (e) {
        console.warn(`Skipping proposal ${tokenId}:`, e.message)
      }
    }

    return proposals
  } catch (e) {
    console.error('Failed to fetch proposals:', e)
    return []
  }
}

/**
 * Accept a proposal on-chain (triggers CoupleNFT auto-mint)
 */
export async function acceptProposalOnChain(signer, tokenId, coupleImageURI, coupleMetadataURI) {
  const contract = getProposalContract(signer)
  const tx = await contract.acceptProposal(tokenId, coupleImageURI, coupleMetadataURI)
  const receipt = await tx.wait()

  return {
    txHash: receipt.hash,
    receipt
  }
}

/**
 * Reject a proposal on-chain
 */
export async function rejectProposalOnChain(signer, tokenId) {
  const contract = getProposalContract(signer)
  const tx = await contract.rejectProposal(tokenId)
  const receipt = await tx.wait()
  return { txHash: receipt.hash, receipt }
}

/**
 * Get all SoulBound connections for a user
 */
export async function getUserConnections(signerOrProvider, userAddress) {
  const contract = getCoupleContract(signerOrProvider)
  try {
    const tokenIds = await contract.getUserConnections(userAddress)
    const connections = []

    for (const tokenId of tokenIds) {
      try {
        const conn = await contract.getConnection(tokenId)
        connections.push({
          tokenId: tokenId.toString(),
          person1: conn.person1,
          person2: conn.person2,
          timestamp: Number(conn.timestamp) * 1000,
          imageURI: conn.coupleImageURI
        })
      } catch (e) {
        console.warn(`Skipping connection ${tokenId}:`, e.message)
      }
    }

    return connections
  } catch (e) {
    console.error('Failed to fetch connections:', e)
    return []
  }
}

/**
 * Get total stats from both contracts
 */
export async function getContractStats(provider) {
  try {
    const proposalContract = new ethers.Contract(PROPOSAL_NFT_ADDRESS, contractData.ProposalNFT.abi, provider)
    const coupleContract = getCoupleContract(provider)

    const [totalProposals, totalConnections] = await Promise.all([
      proposalContract.totalProposals(),
      coupleContract.totalConnections()
    ])

    return {
      totalProposals: Number(totalProposals),
      totalConnections: Number(totalConnections)
    }
  } catch (e) {
    console.error('Failed to fetch stats:', e)
    return { totalProposals: 0, totalConnections: 0 }
  }
}
