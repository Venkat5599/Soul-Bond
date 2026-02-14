import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWeb3 } from '../context/Web3Context'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { account, connectWallet, disconnectWallet, shortenAddress, connecting } = useWeb3()
  const { theme, toggleTheme, isDark } = useTheme()
  const location = useLocation()

  const navLinks = [
    { label: 'Propose', path: '/propose' },
    { label: 'Inbox', path: '/inbox' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Manifesto', path: '/manifesto' },
  ]

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        className={`flex items-center gap-1 px-4 py-2.5 rounded-full ${
          isDark ? 'glass-nav' : 'glass-nav-light'
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center mr-3">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
            isDark ? 'border-white/30' : 'border-black/30'
          }`}>
            <svg viewBox="0 0 24 24" className={`w-4 h-4 ${isDark ? 'fill-white' : 'fill-black'}`}>
              <path d="M12 4C8 4 4 8 4 12C4 18 12 22 12 22C12 22 20 18 20 12C20 8 16 4 12 4Z" />
            </svg>
          </div>
        </Link>

        {/* Nav Links */}
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              location.pathname === link.path
                ? isDark
                  ? 'bg-white/10 text-white'
                  : 'bg-black/5 text-black'
                : isDark
                ? 'text-white/70 hover:text-white'
                : 'text-black/60 hover:text-black'
            }`}
          >
            {link.label}
          </Link>
        ))}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
            className={`px-2.5 py-1.5 rounded-full text-sm transition-colors ${
              isDark
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-black/60 hover:text-black hover:bg-black/5'
            }`}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

        {/* Wallet / Sign In */}
        {account ? (
          <button
            onClick={disconnectWallet}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isDark
                ? 'text-white/70 hover:text-white'
                : 'text-black/60 hover:text-black'
            }`}
          >
            {shortenAddress(account)}
          </button>
        ) : (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isDark
                ? 'text-white/70 hover:text-white'
                : 'text-black/60 hover:text-black'
            }`}
          >
            {connecting ? 'Connecting...' : 'Sign in'}
          </button>
        )}
      </div>
    </motion.nav>
  )
}
