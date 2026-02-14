import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

const Web3Context = createContext(null)

const USE_LOCAL = import.meta.env.VITE_USE_LOCAL === 'true'

// Sepolia Testnet
const SEPOLIA_TESTNET = {
  chainId: '0xaa36a7',
  chainName: 'Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
}

// Polygon Amoy Testnet
const POLYGON_TESTNET = {
  chainId: '0x13882',
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: ['https://rpc-amoy.polygon.technology'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
}

// Local Hardhat
const HARDHAT_LOCAL = {
  chainId: '0x7A69',
  chainName: 'Hardhat Local',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['http://127.0.0.1:8545'],
  blockExplorerUrls: [],
}

const TARGET_NETWORK = USE_LOCAL ? HARDHAT_LOCAL : SEPOLIA_TESTNET
const TARGET_CHAIN_ID = USE_LOCAL ? 31337 : 11155111

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [connecting, setConnecting] = useState(false)

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask to continue')
      return
    }

    setConnecting(true)
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()

      // Check if we need to switch networks BEFORE requesting accounts
      if (Number(network.chainId) !== TARGET_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: TARGET_NETWORK.chainId }],
          })
        } catch (switchError) {
          if (switchError.code === 4902) {
            // Network doesn't exist, add it
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [TARGET_NETWORK],
            })
          } else {
            throw switchError
          }
        }
        // Wait a bit for network switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Now request accounts after network is correct
      const accounts = await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const finalNetwork = await provider.getNetwork()

      setProvider(provider)
      setSigner(signer)
      setAccount(accounts[0])
      setChainId(Number(finalNetwork.chainId))

      toast.success('Wallet connected!')
    } catch (err) {
      console.error(err)
      if (err.code === 4001) {
        toast.error('Connection rejected')
      } else {
        toast.error('Failed to connect wallet')
      }
    } finally {
      setConnecting(false)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
    toast.success('Wallet disconnected')
  }, [])

  const shortenAddress = useCallback((addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }, [])

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setAccount(accounts[0])
          toast.success('Account switched')
        }
      })

      window.ethereum.on('chainChanged', (chainIdHex) => {
        const newChainId = parseInt(chainIdHex, 16)
        setChainId(newChainId)
        
        // Only reload if we're on the wrong network
        if (newChainId !== TARGET_CHAIN_ID) {
          toast.error(`Please switch to ${TARGET_NETWORK.chainName}`)
        } else {
          toast.success('Network switched successfully')
          // Refresh provider and signer
          const provider = new ethers.BrowserProvider(window.ethereum)
          provider.getSigner().then(signer => {
            setProvider(provider)
            setSigner(signer)
          })
        }
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
    }
  }, [disconnectWallet])

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        chainId,
        connecting,
        connectWallet,
        disconnectWallet,
        shortenAddress,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) throw new Error('useWeb3 must be used within Web3Provider')
  return context
}
