import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Web3Provider } from './context/Web3Context'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import Landing from './pages/Landing'
import Propose from './pages/Propose'
import Inbox from './pages/Inbox'
import Gallery from './pages/Gallery'
import Manifesto from './pages/Manifesto'

function AppContent() {
  const { isDark } = useTheme()
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: isDark ? '#1a1a1a' : '#fff',
            color: isDark ? '#fff' : '#1a1a1a',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/propose" element={<Propose />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/manifesto" element={<Manifesto />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Web3Provider>
        <AppContent />
      </Web3Provider>
    </ThemeProvider>
  )
}

export default App
