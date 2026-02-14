/**
 * IPFS Upload Service
 * Supports Pinata (with JWT) or falls back to data URL storage for demo
 */

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT
const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs'

/**
 * Check if Pinata is configured
 */
export function isPinataConfigured() {
  return !!PINATA_JWT && PINATA_JWT.length > 10
}

/**
 * Convert a data URL (base64) to a File/Blob
 */
function dataURLtoBlob(dataURL) {
  const [header, data] = dataURL.split(',')
  const mime = header.match(/:(.*?);/)[1]
  const binary = atob(data)
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i)
  }
  return new Blob([array], { type: mime })
}

/**
 * Upload an image to IPFS via Pinata
 * @param {string} imageDataURL - Base64 data URL of the image
 * @param {string} name - Name for the file
 * @returns {string} IPFS URI (ipfs://...)
 */
export async function uploadImageToIPFS(imageDataURL, name) {
  if (!isPinataConfigured()) {
    // Fallback: store as data URL (works for local demo)
    console.warn('Pinata not configured — using data URL fallback')
    return imageDataURL
  }

  try {
    const blob = dataURLtoBlob(imageDataURL)
    const formData = new FormData()
    formData.append('file', blob, `${name}.png`)

    const metadata = JSON.stringify({
      name: `SoulBound - ${name}`,
      keyvalues: { project: 'soulbound' }
    })
    formData.append('pinataMetadata', metadata)

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PINATA_JWT}`
      },
      body: formData
    })

    if (!res.ok) {
      throw new Error(`Pinata upload failed: ${res.status}`)
    }

    const data = await res.json()
    return `ipfs://${data.IpfsHash}`
  } catch (err) {
    console.error('IPFS image upload failed:', err)
    // Fallback to data URL
    return imageDataURL
  }
}

/**
 * Upload NFT metadata JSON to IPFS via Pinata
 * @param {object} metadata - ERC-721 metadata object
 * @returns {string} IPFS URI (ipfs://...)
 */
export async function uploadMetadataToIPFS(metadata) {
  if (!isPinataConfigured()) {
    // Fallback: create a data URL with JSON
    console.warn('Pinata not configured — using data URL fallback for metadata')
    const jsonStr = JSON.stringify(metadata)
    // Use encodeURIComponent to handle special characters
    return `data:application/json;charset=utf-8,${encodeURIComponent(jsonStr)}`
  }

  try {
    const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: metadata.name || 'SoulBound Metadata',
          keyvalues: { project: 'soulbound' }
        }
      })
    })

    if (!res.ok) {
      throw new Error(`Pinata metadata upload failed: ${res.status}`)
    }

    const data = await res.json()
    return `ipfs://${data.IpfsHash}`
  } catch (err) {
    console.error('IPFS metadata upload failed:', err)
    const jsonStr = JSON.stringify(metadata)
    // Use encodeURIComponent to handle special characters
    return `data:application/json;charset=utf-8,${encodeURIComponent(jsonStr)}`
  }
}

/**
 * Create ERC-721 metadata for a proposal NFT
 */
export function createProposalMetadata({ senderName, receiverName, message }) {
  return {
    name: `SoulBound Proposal: ${senderName} → ${receiverName}`,
    description: message || `A SoulBound connection proposal from ${senderName} to ${receiverName}`,
    image: '', // Will be set after image upload
    attributes: [
      { trait_type: 'Type', value: 'Proposal' },
      { trait_type: 'From', value: senderName },
      { trait_type: 'To', value: receiverName },
      { trait_type: 'Date', value: new Date().toISOString() }
    ]
  }
}

/**
 * Create ERC-721 metadata for a couple NFT
 */
export function createCoupleMetadata({ senderName, receiverName, imageURI }) {
  return {
    name: `SoulBound: ${senderName} & ${receiverName}`,
    description: `An immutable, non-transferable proof of connection between ${senderName} and ${receiverName}. Forged on the blockchain, bound to their souls forever.`,
    image: imageURI,
    attributes: [
      { trait_type: 'Type', value: 'SoulBound Connection' },
      { trait_type: 'Person 1', value: senderName },
      { trait_type: 'Person 2', value: receiverName },
      { trait_type: 'Forged', value: new Date().toISOString() },
      { trait_type: 'Transferable', value: 'No' }
    ]
  }
}

/**
 * Resolve an IPFS URI to an HTTP gateway URL
 */
export function resolveIPFSUrl(uri) {
  if (!uri) return ''
  if (uri.startsWith('data:')) return uri
  if (uri.startsWith('ipfs://')) {
    const hash = uri.replace('ipfs://', '')
    if (PINATA_GATEWAY) return `${PINATA_GATEWAY}/${hash}`
    return `https://gateway.pinata.cloud/ipfs/${hash}`
  }
  return uri
}
