import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeb3 } from '../context/Web3Context'
import { useTheme } from '../context/ThemeContext'
import { createProposalOnChain } from '../services/contractService'
import { uploadMetadataToIPFS, createProposalMetadata } from '../services/ipfsService'
import toast from 'react-hot-toast'
import { Heart, Send, Upload, Sparkles } from 'lucide-react'
import { ethers } from 'ethers'

export default function ProposalCreate() {
  const { account, signer } = useWeb3()
  const [recipientAddress, setRecipientAddress] = useState('')
  const [senderName, setSenderName] = useState('')
  const [receiverName, setReceiverName] = useState('')
  const [message, setMessage] = useState('')
  const [senderAvatar, setSenderAvatar] = useState(null)
  const [receiverAvatar, setReceiverAvatar] = useState(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [txHash, setTxHash] = useState('')
  const senderFileRef = useRef(null)
  const receiverFileRef = useRef(null)
  const { isDark } = useTheme()

  const handleAvatarUpload = (e, setter) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setter(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSendProposal = async () => {
    if (!recipientAddress) {
      toast.error('Please enter recipient wallet address')
      return
    }
    if (!ethers.isAddress(recipientAddress)) {
      toast.error('Invalid Ethereum address')
      return
    }
    if (!senderName || !receiverName) {
      toast.error('Please enter both names')
      return
    }
    if (!signer) {
      toast.error('Please connect your wallet first')
      return
    }

    setSending(true)
    try {
      // 1. Create and upload proposal metadata to IPFS
      toast.loading('Uploading metadata...', { id: 'proposal' })
      const metadata = createProposalMetadata({ senderName, receiverName, message })
      const metadataURI = await uploadMetadataToIPFS(metadata)

      // 2. Call smart contract to mint proposal NFT
      toast.loading('Minting Proposal NFT...', { id: 'proposal' })
      const result = await createProposalOnChain(signer, {
        recipient: recipientAddress,
        message: message || '',
        senderName,
        receiverName,
        metadataURI
      })

      // 3. Also save avatar data to localStorage for the recipient to use during accept
      // (avatars are too large for on-chain storage)
      const proposalAvatars = JSON.parse(localStorage.getItem('soulbound_avatars') || '{}')
      proposalAvatars[result.tokenId] = { senderAvatar, receiverAvatar }
      localStorage.setItem('soulbound_avatars', JSON.stringify(proposalAvatars))

      setTxHash(result.txHash)
      setSent(true)
      toast.success('Proposal NFT minted on-chain! 💖', { id: 'proposal' })
    } catch (err) {
      console.error(err)
      const reason = err.reason || err.message || 'Transaction failed'
      toast.error(reason.includes('Cannot propose to yourself')
        ? 'You cannot propose to yourself!'
        : `Failed: ${reason.slice(0, 80)}`,
        { id: 'proposal' }
      )
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-20"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-6xl mb-6"
        >
          💖
        </motion.div>
        <h2 className={`font-serif text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
          Proposal Sent!
        </h2>
        <p className={`mb-2 ${isDark ? 'text-white/50' : 'text-[#1a1a1a]/50'}`}>
          Your SoulBound proposal has been minted on-chain to
        </p>
        <p className={`font-mono text-sm inline-block px-4 py-2 rounded-full ${isDark ? 'text-white/70 bg-white/5' : 'text-[#1a1a1a]/70 bg-black/5'}`}>
          {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
        </p>
        {txHash && (
          <div className={`mt-4 p-3 rounded-xl max-w-md mx-auto ${isDark ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
            <p className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>Transaction Hash</p>
            <p className={`font-mono text-xs break-all ${isDark ? 'text-white/60' : 'text-[#1a1a1a]/60'}`}>{txHash}</p>
          </div>
        )}
        <p className={`text-sm mt-4 ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
          They will see it in their inbox and can accept or decline.
        </p>
        <button
          onClick={() => {
            setSent(false)
            setTxHash('')
            setRecipientAddress('')
            setSenderName('')
            setReceiverName('')
            setMessage('')
            setSenderAvatar(null)
            setReceiverAvatar(null)
          }}
          className="mt-8 px-6 py-2.5 rounded-full cta-button text-white text-sm"
        >
          Send Another
        </button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={`font-serif text-3xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
          Create Proposal
        </h2>
        <p className={`text-sm text-center mb-8 ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
          Forge an immutable bond on the blockchain
        </p>

        {/* Avatars */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* Sender Avatar */}
          <div className="text-center">
            <div
              onClick={() => senderFileRef.current?.click()}
              className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${isDark ? 'border-white/20 hover:border-white/40 bg-white/5' : 'border-black/20 hover:border-black/40 bg-black/5'}`}
            >
              {senderAvatar ? (
                <img src={senderAvatar} alt="You" className="w-full h-full object-cover" />
              ) : (
                <Upload className={`w-6 h-6 ${isDark ? 'text-white/30' : 'text-black/30'}`} />
              )}
            </div>
            <input
              ref={senderFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleAvatarUpload(e, setSenderAvatar)}
              className="hidden"
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>Your photo</p>
          </div>

          <Heart className="w-6 h-6 text-red-400/50" />

          {/* Receiver Avatar */}
          <div className="text-center">
            <div
              onClick={() => receiverFileRef.current?.click()}
              className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors overflow-hidden ${isDark ? 'border-white/20 hover:border-white/40 bg-white/5' : 'border-black/20 hover:border-black/40 bg-black/5'}`}
            >
              {receiverAvatar ? (
                <img src={receiverAvatar} alt="Them" className="w-full h-full object-cover" />
              ) : (
                <Upload className={`w-6 h-6 ${isDark ? 'text-white/30' : 'text-black/30'}`} />
              )}
            </div>
            <input
              ref={receiverFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleAvatarUpload(e, setReceiverAvatar)}
              className="hidden"
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>Their photo</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>Your Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your name"
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-white/30' : 'bg-black/5 border border-black/10 text-[#1a1a1a] placeholder:text-black/20 focus:border-black/30'}`}
              />
            </div>
            <div>
              <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>Their Name</label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Their name"
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-white/30' : 'bg-black/5 border border-black/10 text-[#1a1a1a] placeholder:text-black/20 focus:border-black/30'}`}
              />
            </div>
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>Recipient Wallet Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className={`w-full rounded-xl px-4 py-3 text-sm font-mono focus:outline-none transition-colors ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-white/30' : 'bg-black/5 border border-black/10 text-[#1a1a1a] placeholder:text-black/20 focus:border-black/30'}`}
            />
          </div>

          <div>
            <label className={`text-xs mb-1 block ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>Personal Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something from the heart..."
              rows={3}
              className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors resize-none ${isDark ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-white/30' : 'bg-black/5 border border-black/10 text-[#1a1a1a] placeholder:text-black/20 focus:border-black/30'}`}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSendProposal}
            disabled={sending}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-pink-500/20 transition-shadow"
          >
            {sending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Minting Proposal NFT...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Proposal
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
