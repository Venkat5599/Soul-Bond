import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { ExternalLink, Download as DownloadIcon, RefreshCw } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useWeb3 } from '../context/Web3Context'
import { getUserConnections } from '../services/contractService'
import { resolveIPFSUrl } from '../services/ipfsService'

export default function Gallery() {
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDark } = useTheme()
  const { account, provider } = useWeb3()

  const fetchConnections = async () => {
    if (!account || !provider) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const connections = await getUserConnections(provider, account)
      setNfts(connections)
    } catch (err) {
      console.error('Failed to fetch connections:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [account, provider])

  const handleDownload = (imageData, name) => {
    const link = document.createElement('a')
    link.download = `soulbound-${name}.png`
    link.href = imageData
    link.click()
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] halftone-dark' : 'bg-[#f5f0eb] halftone-light'}`}>
      <Navbar />
      <div className="pt-28 pb-16 px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className={`font-serif text-4xl font-bold ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
              SoulBound Gallery
            </h2>
            <button
              onClick={fetchConnections}
              className={`p-1.5 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white/40' : 'hover:bg-black/10 text-[#1a1a1a]/40'}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <p className={`text-sm ${isDark ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
            {account ? 'Your forged connections — immutable and eternal' : 'Connect your wallet to view your SoulBound NFTs'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-pink-500/30 border-t-pink-500 rounded-full mx-auto mb-4"
            />
            <p className={`text-sm ${isDark ? 'text-white/30' : 'text-[#1a1a1a]/30'}`}>Loading from blockchain...</p>
          </div>
        ) : nfts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🖼️</div>
            <p className={`text-sm ${isDark ? 'text-white/30' : 'text-[#1a1a1a]/30'}`}>No SoulBound NFTs yet</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-white/20' : 'text-[#1a1a1a]/20'}`}>
              Accept a proposal to mint your first couple NFT
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <AnimatePresence>
              {nfts.map((nft, i) => (
                <motion.div
                  key={nft.tokenId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl overflow-hidden transition-colors group ${isDark ? 'bg-white/[0.03] border border-white/[0.06] hover:border-white/10' : 'bg-black/[0.03] border border-black/[0.06] hover:border-black/10'}`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={resolveIPFSUrl(nft.imageURI)}
                      alt={`Connection #${nft.tokenId}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className={`font-medium text-sm mb-1 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                      Connection #{nft.tokenId}
                    </h3>
                    <p className={`text-xs font-mono mb-1 ${isDark ? 'text-white/30' : 'text-[#1a1a1a]/30'}`}>
                      {nft.person1.slice(0, 6)}...{nft.person1.slice(-4)} & {nft.person2.slice(0, 6)}...{nft.person2.slice(-4)}
                    </p>
                    <p className={`text-xs mb-3 ${isDark ? 'text-white/30' : 'text-[#1a1a1a]/30'}`}>
                      {new Date(nft.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="flex gap-2">
                      {nft.imageURI && !nft.imageURI.startsWith('data:') && (
                        <a
                          href={resolveIPFSUrl(nft.imageURI)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors ${isDark ? 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70' : 'bg-black/5 text-black/50 hover:bg-black/10 hover:text-black/70'}`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          IPFS
                        </a>
                      )}
                      {nft.imageURI && nft.imageURI.startsWith('data:') && (
                        <button
                          onClick={() => handleDownload(nft.imageURI, `connection-${nft.tokenId}`)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors ${isDark ? 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70' : 'bg-black/5 text-black/50 hover:bg-black/10 hover:text-black/70'}`}
                        >
                          <DownloadIcon className="w-3 h-3" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
