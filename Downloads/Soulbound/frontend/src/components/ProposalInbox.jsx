import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Clock, User, RefreshCw } from 'lucide-react'
import { useWeb3 } from '../context/Web3Context'
import { useTheme } from '../context/ThemeContext'
import { getProposalsForRecipient, acceptProposalOnChain, rejectProposalOnChain } from '../services/contractService'
import { uploadImageToIPFS, uploadMetadataToIPFS, createCoupleMetadata } from '../services/ipfsService'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

export default function ProposalInbox() {
  const { account, signer, provider } = useWeb3()
  const { isDark } = useTheme()
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [acceptingId, setAcceptingId] = useState(null)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [mintingNFT, setMintingNFT] = useState(false)
  const [mintedResult, setMintedResult] = useState(null)
  const [currentProposal, setCurrentProposal] = useState(null)

  // Fetch proposals from blockchain
  const fetchProposals = async () => {
    if (!account || !provider) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const onChainProposals = await getProposalsForRecipient(provider, account)
      setProposals(onChainProposals)
    } catch (err) {
      console.error('Failed to fetch proposals:', err)
      toast.error('Failed to load proposals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProposals()
  }, [account, provider])

  const handleAccept = async (proposal) => {
    if (!signer) {
      toast.error('Please connect your wallet')
      return
    }

    setCurrentProposal(proposal)
    setAcceptingId(proposal.tokenId)
    setMintingNFT(true)

    try {
      // Use a simple placeholder image instead of generating
      const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgZmlsbD0iIzFhMGEyZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LXNpemU9IjgwIiBmaWxsPSIjZmY2OWI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5KWPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U291bEJvdW5kPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LXNpemU9IjE2IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNSkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkZvcmdlZCBGb3JldmVyPC90ZXh0Pjwvc3ZnPg=='
      
      setGeneratedImage(placeholderImage)

      // 1. Upload image to IPFS
      toast.loading('✨ Capturing your beautiful moment...', { id: 'mint' })
      const imageURI = await uploadImageToIPFS(
        placeholderImage,
        `${proposal.senderName}-${proposal.receiverName}`
      )

      // 2. Create and upload metadata to IPFS
      toast.loading('💫 Preserving your love story...', { id: 'mint' })
      const metadata = createCoupleMetadata({
        senderName: proposal.senderName,
        receiverName: proposal.receiverName,
        imageURI
      })
      const metadataURI = await uploadMetadataToIPFS(metadata)

      // 3. Accept proposal on-chain (auto-mints CoupleNFT)
      toast.loading('💝 Forging your eternal bond on-chain...', { id: 'mint' })
      const result = await acceptProposalOnChain(
        signer,
        proposal.tokenId,
        imageURI,
        metadataURI
      )

      setMintedResult({
        txHash: result.txHash,
        senderName: proposal.senderName,
        receiverName: proposal.receiverName,
        image: placeholderImage
      })

      toast.success('SoulBound Couple NFT minted on-chain! 🎉', { id: 'mint' })
      
      // Trigger confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#ff69b4', '#9b59b6', '#e74c3c']
      })
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff6b6b', '#ff69b4', '#9b59b6']
        })
      }, 250)
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff6b6b', '#ff69b4', '#9b59b6']
        })
      }, 400)
    } catch (err) {
      console.error('Minting failed:', err)
      toast.error(`Minting failed: ${err.message || 'Unknown error'}`, { id: 'mint' })
    } finally {
      setMintingNFT(false)
      setAcceptingId(null)
    }
  }

  const handleReject = async (proposal) => {
    if (!signer) {
      toast.error('Please connect your wallet')
      return
    }
    try {
      toast.loading('Rejecting proposal...', { id: 'reject' })
      await rejectProposalOnChain(signer, proposal.tokenId)
      toast.success('Proposal declined', { id: 'reject' })
      // Update local state
      setProposals(prev => prev.map(p =>
        p.tokenId === proposal.tokenId ? { ...p, status: 'rejected' } : p
      ))
    } catch (err) {
      console.error(err)
      toast.error('Failed to reject proposal', { id: 'reject' })
    }
  }

  const handleImageGenerated = async (imageData, proposal) => {
    setGeneratedImage(imageData)
    setMintingNFT(true)

    try {
      // 1. Upload couple image to IPFS
      toast.loading('✨ Capturing your beautiful moment...', { id: 'mint' })
      const imageURI = await uploadImageToIPFS(
        imageData,
        `${proposal.senderName}-${proposal.receiverName}`
      )

      // 2. Create and upload metadata to IPFS
      toast.loading('💫 Preserving your love story...', { id: 'mint' })
      const metadata = createCoupleMetadata({
        senderName: proposal.senderName,
        receiverName: proposal.receiverName,
        imageURI
      })
      const metadataURI = await uploadMetadataToIPFS(metadata)

      // 3. Accept proposal on-chain (auto-mints CoupleNFT)
      toast.loading('💝 Forging your eternal bond on-chain...', { id: 'mint' })
      const result = await acceptProposalOnChain(
        signer,
        proposal.tokenId,
        imageURI,
        metadataURI
      )

      setMintedResult({
        txHash: result.txHash,
        senderName: proposal.senderName,
        receiverName: proposal.receiverName,
        image: imageData
      })

      toast.success('SoulBound Couple NFT minted on-chain! 🎉', { id: 'mint' })
      
      // Trigger confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#ff69b4', '#9b59b6', '#e74c3c']
      })
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff6b6b', '#ff69b4', '#9b59b6']
        })
      }, 250)
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff6b6b', '#ff69b4', '#9b59b6']
        })
      }, 400)
    } catch (err) {
      console.error('Minting failed:', err)
      toast.error(`Minting failed: ${(err.reason || err.message || '').slice(0, 80)}`, { id: 'mint' })
    } finally {
      setMintingNFT(false)
    }
  }

  // Show minted result
  if (mintedResult) {
    const explorerBase = import.meta.env.VITE_USE_LOCAL === 'true'
      ? null
      : 'https://amoy.polygonscan.com/tx/'

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl mb-4"
        >
          🎉
        </motion.div>
        <h2 className={`font-serif text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
          SoulBound NFT Minted!
        </h2>
        <p className={`text-sm mb-6 ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
          Your connection is now permanently recorded on the blockchain
        </p>

        {generatedImage && (
          <motion.img
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            src={generatedImage}
            alt="Couple NFT"
            className={`w-72 h-72 mx-auto rounded-2xl shadow-2xl shadow-pink-500/20 mb-6 pulse-glow ${isDark ? 'border border-white/10' : 'border border-black/10'}`}
          />
        )}

        <div className={`rounded-xl p-4 max-w-md mx-auto mb-6 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
          <p className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>Transaction Hash</p>
          <p className={`font-mono text-xs break-all ${isDark ? 'text-white/70' : 'text-[#1a1a1a]/70'}`}>{mintedResult.txHash}</p>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setMintedResult(null)
              setAcceptingId(null)
              setGeneratedImage(null)
              setCurrentProposal(null)
              fetchProposals()
            }}
            className="px-6 py-2.5 rounded-full cta-button text-white text-sm"
          >
            Back to Inbox
          </button>
          {explorerBase && (
            <a
              href={`${explorerBase}${mintedResult.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-6 py-2.5 rounded-full text-sm transition-colors ${isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-black/10 text-[#1a1a1a] hover:bg-black/15'}`}
            >
              View on Explorer
            </a>
          )}
        </div>
      </motion.div>
    )
  }

  // Show minting progress
  if (acceptingId && mintingNFT) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full mx-auto mb-6"
        />
        <h2 className={`font-serif text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
          Forging Your SoulBound Connection
        </h2>
        <p className={`text-sm ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
          Please wait while we mint your NFT on-chain...
        </p>
      </motion.div>
    )
  }
              />
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-[#1a1a1a]/60'}`}>Minting SoulBound NFT on-chain...</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  // Show inbox
  return (
    <div>
      <div className="flex items-center justify-center gap-3 mb-2">
        <h2 className={`font-serif text-3xl font-bold text-center ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
          Proposal Inbox
        </h2>
        <button
          onClick={fetchProposals}
          className={`p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white/40' : 'hover:bg-black/10 text-[#1a1a1a]/40'}`}
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <p className={`text-sm text-center mb-8 ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
        {account ? 'Pending connection requests for your wallet' : 'Connect your wallet to see proposals'}
      </p>

      {loading ? (
        <div className="text-center py-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full mx-auto mb-4"
          />
          <p className={`text-sm ${isDark ? 'text-white/30' : 'text-[#1a1a1a]/30'}`}>Loading from blockchain...</p>
        </div>
      ) : !account ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔗</div>
          <p className={`text-sm ${isDark ? 'text-white/30' : 'text-[#1a1a1a]/30'}`}>Connect your wallet to see proposals</p>
        </div>
      ) : proposals.filter(p => p.status === 'pending').length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📭</div>
          <p className={`text-sm ${isDark ? 'text-white/30' : 'text-[#1a1a1a]/30'}`}>No pending proposals</p>
          <p className={`text-xs mt-1 ${isDark ? 'text-white/20' : 'text-[#1a1a1a]/20'}`}>Share your wallet address to receive proposals</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-lg mx-auto">
          <AnimatePresence>
            {proposals.filter(p => p.status === 'pending').map((proposal, i) => (
              <motion.div
                key={proposal.tokenId}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-5 transition-colors ${isDark ? 'bg-white/5 border border-white/10 hover:border-white/20' : 'bg-black/5 border border-black/10 hover:border-black/20'}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <User className={`w-5 h-5 ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{proposal.senderName}</span>
                      <span className={isDark ? 'text-white/20' : 'text-[#1a1a1a]/20'}>→</span>
                      <span className={`text-sm ${isDark ? 'text-white/60' : 'text-[#1a1a1a]/60'}`}>{proposal.receiverName}</span>
                    </div>

                    <p className={`text-xs font-mono mb-2 ${isDark ? 'text-white/30' : 'text-[#1a1a1a]/30'}`}>
                      from {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                    </p>

                    {proposal.message && (
                      <p className={`text-sm mb-3 italic ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>"{proposal.message}"</p>
                    )}

                    <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-white/20' : 'text-[#1a1a1a]/20'}`}>
                      <Clock className="w-3 h-3" />
                      {new Date(proposal.timestamp).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAccept(proposal)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-medium hover:shadow-lg hover:shadow-pink-500/20 transition-shadow"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        Accept
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReject(proposal)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-colors ${isDark ? 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10' : 'bg-black/5 text-[#1a1a1a]/60 hover:bg-black/10 border border-black/10'}`}
                      >
                        <X className="w-3.5 h-3.5" />
                        Decline
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
