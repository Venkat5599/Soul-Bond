import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Heart, Zap, Lock, Globe, Sparkles } from 'lucide-react'
import { useWeb3 } from '../context/Web3Context'
import { useTheme } from '../context/ThemeContext'

const features = [
  {
    icon: Heart,
    title: 'Proposal NFTs',
    description: 'Create a digital proposal and send it to someone special. Express your connection through blockchain.',
  },
  {
    icon: Shield,
    title: 'SoulBound Tokens',
    description: 'Accepted proposals mint non-transferable couple NFTs — permanent proof of your bond.',
  },
  {
    icon: Sparkles,
    title: 'AI-Generated Art',
    description: 'Each acceptance generates a unique couple image using canvas effects and particle magic.',
  },
  {
    icon: Lock,
    title: 'Immutable Proof',
    description: 'Your connection lives forever on the Polygon blockchain. No one can erase it.',
  },
  {
    icon: Globe,
    title: 'Decentralized',
    description: 'Images stored on IPFS, metadata on-chain. Fully decentralized and censorship-resistant.',
  },
  {
    icon: Zap,
    title: 'Near-Zero Fees',
    description: 'Built on Polygon — minting costs fractions of a cent. Connection shouldn\'t cost a fortune.',
  },
]

const steps = [
  { num: '01', title: 'Connect Wallet', desc: 'Link your MetaMask wallet to get started' },
  { num: '02', title: 'Create Proposal', desc: 'Upload photos, write a message, enter their wallet' },
  { num: '03', title: 'They Decide', desc: 'Recipient can accept ❤️ or decline ❌' },
  { num: '04', title: 'Bond Forged', desc: 'Acceptance mints a SoulBound Couple NFT forever' },
]

export default function Landing() {
  const { connectWallet, account } = useWeb3()
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Features Section */}
      <section className={`py-24 px-6 ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f5f0e8]'}`}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`font-serif text-4xl md:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
              How it works
            </h2>
            <p className={`max-w-md mx-auto ${isDark ? 'text-white/40' : 'text-black/40'}`}>
              SoulBound creates permanent proof of connection on the blockchain
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 transition-colors group ${
                  isDark
                    ? 'bg-white/[0.03] border border-white/[0.06] hover:border-white/10'
                    : 'bg-black/[0.02] border border-black/[0.06] hover:border-black/10'
                }`}
              >
                <feature.icon className={`w-8 h-8 mb-4 group-hover:text-pink-400/60 transition-colors ${isDark ? 'text-white/30' : 'text-black/30'}`} />
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{feature.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/40' : 'text-black/40'}`}>{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className={`font-serif text-3xl font-bold mb-12 text-center ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
              Four simple steps
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className={`text-4xl font-serif font-bold mb-3 ${isDark ? 'text-white/10' : 'text-black/10'}`}>{step.num}</div>
                  <h3 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>{step.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-white/30' : 'text-black/30'}`}>{step.desc}</p>
                  {i < steps.length - 1 && (
                    <ArrowRight className={`w-4 h-4 mx-auto mt-4 hidden md:block ${isDark ? 'text-white/10' : 'text-black/10'}`} />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className={`rounded-3xl p-12 ${
              isDark
                ? 'bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06]'
                : 'bg-gradient-to-br from-black/[0.02] to-black/[0.01] border border-black/[0.06]'
            }`}>
              <h2 className={`font-serif text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
                Ready to forge a connection?
              </h2>
              <p className={`mb-8 max-w-md mx-auto ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                Create your first SoulBound proposal and make your bond permanent on the blockchain.
              </p>
              {account ? (
                <Link
                  to="/propose"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/20 transition-shadow"
                >
                  Create Proposal <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={connectWallet}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/20 transition-shadow"
                >
                  Connect Wallet <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-8 px-6 ${isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-[#f5f0e8] border-black/5'}`}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isDark ? 'border-white/20' : 'border-black/20'}`}>
              <svg viewBox="0 0 24 24" className={`w-3 h-3 ${isDark ? 'fill-white' : 'fill-black'}`}>
                <path d="M12 4C8 4 4 8 4 12C4 18 12 22 12 22C12 22 20 18 20 12C20 8 16 4 12 4Z" />
              </svg>
            </div>
            <span className={`text-sm ${isDark ? 'text-white/40' : 'text-black/40'}`}>SoulBound</span>
          </div>
          <p className={`text-xs ${isDark ? 'text-white/20' : 'text-black/20'}`}>
            Built with ❤️ for human connection • Polygon Testnet
          </p>
        </div>
      </footer>
    </div>
  )
}
