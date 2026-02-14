import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../context/Web3Context'
import { useTheme } from '../context/ThemeContext'

export default function Hero() {
  const { connectWallet, account } = useWeb3()
  const { isDark } = useTheme()

  const handsImg = isDark ? '/hands/hands-dark.png' : '/hands/hands-light.png'

  return (
    <section
      className={`relative min-h-screen overflow-hidden ${
        isDark ? 'bg-[#0a0a0a]' : 'bg-[#f0ebe4]'
      }`}
    >
      {/* Layer 1: Background hands image — centered on fingertip focal point */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${handsImg})`,
          backgroundSize: 'cover',
          backgroundPosition: '50% 45%',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Layer 2: Gradient overlay — clear center for fingertips, darker edges for text */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: isDark
            ? `radial-gradient(ellipse 60% 50% at 50% 45%, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.7) 100%)`
            : `radial-gradient(ellipse 60% 50% at 50% 45%, rgba(240,235,228,0.1) 0%, rgba(240,235,228,0.7) 100%)`,
        }}
      />

      {/* Layer 3: Halftone texture */}
      <div className={`absolute inset-0 z-[2] pointer-events-none ${isDark ? 'halftone-dark' : 'halftone-light'}`} />

      {/* Layer 4: Heading + subtitle — top center */}
      <div className="absolute z-[3] left-0 right-0 flex flex-col items-center text-center pt-16 md:pt-20 lg:pt-24 px-6">
        <motion.h1
          initial={{ y: 35, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`font-serif font-bold leading-[1.1] tracking-tight
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl
            ${isDark ? 'text-white' : 'text-[#1a1a1a]'}`}
        >
          Bringing people
          <br />
          together in a
          <br />
          <span className="tracking-disconnected">disconnected</span>
          <br />
          world
        </motion.h1>

        <motion.p
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`mt-5 text-sm sm:text-base max-w-[420px] leading-relaxed
            ${isDark ? 'text-white/55' : 'text-black/45'}`}
        >
          Forge immutable, non-transferable bonds on the blockchain
        </motion.p>
      </div>

      {/* Layer 5: CTA Button — at the fingertip meeting point */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute z-[4]"
        style={{
          left: '43%',
          top: '49.5%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {account ? (
          <Link
            to="/propose"
            className={`inline-block px-10 py-4 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300
              shadow-[0_0_30px_rgba(255,255,255,0.15)] backdrop-blur-sm
              ${isDark
                ? 'bg-white/95 text-[#0a0a0a] hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]'
                : 'bg-[#1a1a1a]/95 text-white hover:bg-black hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]'
              }`}
          >
            Create a Proposal
          </Link>
        ) : (
          <button
            onClick={connectWallet}
            className={`px-10 py-4 rounded-full text-sm font-semibold tracking-wide uppercase transition-all duration-300
              shadow-[0_0_30px_rgba(255,255,255,0.15)] backdrop-blur-sm
              ${isDark
                ? 'bg-white/95 text-[#0a0a0a] hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]'
                : 'bg-[#1a1a1a]/95 text-white hover:bg-black hover:shadow-[0_0_40px_rgba(0,0,0,0.3)]'
              }`}
          >
            Join the community
          </button>
        )}
      </motion.div>
    </section>
  )
}
