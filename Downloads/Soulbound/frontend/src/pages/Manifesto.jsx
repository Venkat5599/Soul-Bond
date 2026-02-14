import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function Manifesto() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] halftone-dark' : 'bg-[#f5f0eb] halftone-light'}`}>
      <Navbar />
      <div className="pt-28 pb-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className={`font-serif text-5xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
            Manifesto
          </h1>

          <div className={`space-y-6 leading-relaxed ${isDark ? 'text-white/60' : 'text-[#1a1a1a]/60'}`}>
            <p className="text-lg">
              We live in a world overflowing with connections yet starving for meaning. 
              Followers are not friends. Likes are not love. Status updates are not shared memories.
            </p>

            <p>
              <strong className={isDark ? 'text-white' : 'text-[#1a1a1a]'}>SoulBound</strong> exists to change that. We believe that 
              the most important connections in life deserve to be permanent, verifiable, and beautiful.
            </p>

            <p>
              When you send a SoulBound proposal, you are not just sending a token — you are making a 
              declaration. A commitment written in code that says: <em className={isDark ? 'text-white/80' : 'text-[#1a1a1a]/80'}>"This 
              connection matters to me."</em>
            </p>

            <p>
              When that proposal is accepted, something magical happens. Two avatars merge. 
              A unique, never-before-seen image is generated — a visual representation of your bond. 
              This image is stored on IPFS, and a non-transferable NFT is minted on the blockchain.
            </p>

            <p>
              <strong className={isDark ? 'text-white' : 'text-[#1a1a1a]'}>Non-transferable</strong> means exactly what it sounds like. 
              This token cannot be sold, traded, or given away. It is bound to your soul — hence 
              <em className="text-pink-400/80"> SoulBound</em>.
            </p>

            <div className="border-l-2 border-pink-500/30 pl-6 py-2 my-8">
              <p className={`italic text-lg font-serif ${isDark ? 'text-white/70' : 'text-[#1a1a1a]/70'}`}>
                "In a world of disposable digital interactions, we choose permanence. 
                In a world of transferable assets, we choose commitment. 
                In a disconnected world, we choose connection."
              </p>
            </div>

            <h2 className={`font-serif text-2xl font-bold mt-12 mb-4 ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}>
              Our Vision
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-pink-400 mt-1">→</span>
                <span>Digital friendships verified on-chain</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400 mt-1">→</span>
                <span>Anniversary NFTs that grow with your relationship</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400 mt-1">→</span>
                <span>Shared memories stored permanently on IPFS</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-400 mt-1">→</span>
                <span>A new category of digital assets: proof of human connection</span>
              </li>
            </ul>

            <div className="text-center mt-12">
              <Link
                to="/propose"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/20 transition-shadow"
              >
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
