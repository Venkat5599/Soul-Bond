import React from 'react'
import Navbar from '../components/Navbar'
import ProposalCreate from '../components/ProposalCreate'
import { useWeb3 } from '../context/Web3Context'
import { useTheme } from '../context/ThemeContext'
import { motion } from 'framer-motion'

export default function Propose() {
  const { account, connectWallet } = useWeb3()
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] halftone-dark' : 'bg-[#f5f0e8] halftone-light'}`}>
      <Navbar />
      <div className="pt-28 pb-16 px-6">
        {account ? (
          <ProposalCreate />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-6">🔗</div>
            <h2 className={`font-serif text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
              Connect Your Wallet
            </h2>
            <p className={`text-sm mb-8 max-w-sm mx-auto ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              Link your MetaMask wallet to create and send SoulBound proposals
            </p>
            <button
              onClick={connectWallet}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-medium text-sm hover:shadow-lg hover:shadow-pink-500/20 transition-shadow"
            >
              Connect MetaMask
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
