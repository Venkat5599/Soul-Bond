import React from 'react'
import Navbar from '../components/Navbar'
import ProposalInbox from '../components/ProposalInbox'
import { useTheme } from '../context/ThemeContext'

export default function Inbox() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#0a0a0a] halftone-dark' : 'bg-[#f5f0e8] halftone-light'}`}>
      <Navbar />
      <div className="pt-28 pb-16 px-6">
        <ProposalInbox />
      </div>
    </div>
  )
}
