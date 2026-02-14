import React, { useState, useRef, useEffect, useCallback } from 'react'

/**
 * Canvas-based image generator for SoulBound Couple NFT
 * Merges two avatars with glow effects, particles, and heart decorations
 */
export function generateCoupleImage(senderAvatar, receiverAvatar, senderName, receiverName) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 800
    const ctx = canvas.getContext('2d')

    // Background gradient
    const bgGrad = ctx.createRadialGradient(400, 400, 0, 400, 400, 500)
    bgGrad.addColorStop(0, '#1a0a2e')
    bgGrad.addColorStop(0.5, '#0d0d1a')
    bgGrad.addColorStop(1, '#0a0a0a')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, 800, 800)

    // Star particles in background
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 800
      const y = Math.random() * 800
      const size = Math.random() * 2
      const alpha = Math.random() * 0.5 + 0.1
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Connection line between avatars
    const gradient = ctx.createLinearGradient(150, 350, 650, 350)
    gradient.addColorStop(0, '#ff6b6b')
    gradient.addColorStop(0.5, '#ff69b4')
    gradient.addColorStop(1, '#9b59b6')
    ctx.strokeStyle = gradient
    ctx.lineWidth = 3
    ctx.shadowColor = '#ff69b4'
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.moveTo(280, 350)
    ctx.bezierCurveTo(350, 300, 450, 300, 520, 350)
    ctx.stroke()
    ctx.shadowBlur = 0

    // Heart in the middle
    drawHeart(ctx, 400, 280, 30, '#ff69b4')

    // Floating hearts
    const heartPositions = [
      { x: 300, y: 200, size: 12 },
      { x: 500, y: 220, size: 10 },
      { x: 350, y: 180, size: 8 },
      { x: 450, y: 160, size: 14 },
      { x: 250, y: 250, size: 9 },
      { x: 550, y: 240, size: 11 },
    ]
    heartPositions.forEach((h) => {
      drawHeart(ctx, h.x, h.y, h.size, `rgba(255, 105, 180, ${0.3 + Math.random() * 0.4})`)
    })

    // Glow circles behind avatars
    const glowColors = [
      { x: 220, color: '#ff6b6b' },
      { x: 580, color: '#9b59b6' },
    ]
    glowColors.forEach(({ x, color }) => {
      const glow = ctx.createRadialGradient(x, 350, 0, x, 350, 120)
      glow.addColorStop(0, color + '40')
      glow.addColorStop(0.5, color + '15')
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(x - 120, 230, 240, 240)
    })

    // Load and draw avatars
    const loadImage = (src) =>
      new Promise((res) => {
        if (!src) {
          res(null)
          return
        }
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => res(img)
        img.onerror = () => res(null)
        img.src = src
      })

    Promise.all([loadImage(senderAvatar), loadImage(receiverAvatar)]).then(([img1, img2]) => {
      const avatarSize = 120

      // Draw sender avatar
      ctx.save()
      ctx.beginPath()
      ctx.arc(220, 350, avatarSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      if (img1) {
        ctx.drawImage(img1, 220 - avatarSize / 2, 350 - avatarSize / 2, avatarSize, avatarSize)
      } else {
        ctx.fillStyle = '#333'
        ctx.fill()
        ctx.fillStyle = '#888'
        ctx.font = '40px serif'
        ctx.textAlign = 'center'
        ctx.fillText(senderName[0] || '?', 220, 365)
      }
      ctx.restore()

      // Sender avatar ring
      ctx.strokeStyle = '#ff6b6b'
      ctx.lineWidth = 3
      ctx.shadowColor = '#ff6b6b'
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(220, 350, avatarSize / 2 + 4, 0, Math.PI * 2)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw receiver avatar
      ctx.save()
      ctx.beginPath()
      ctx.arc(580, 350, avatarSize / 2, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()
      if (img2) {
        ctx.drawImage(img2, 580 - avatarSize / 2, 350 - avatarSize / 2, avatarSize, avatarSize)
      } else {
        ctx.fillStyle = '#333'
        ctx.fill()
        ctx.fillStyle = '#888'
        ctx.font = '40px serif'
        ctx.textAlign = 'center'
        ctx.fillText(receiverName[0] || '?', 580, 365)
      }
      ctx.restore()

      // Receiver avatar ring
      ctx.strokeStyle = '#9b59b6'
      ctx.lineWidth = 3
      ctx.shadowColor = '#9b59b6'
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(580, 350, avatarSize / 2 + 4, 0, Math.PI * 2)
      ctx.stroke()
      ctx.shadowBlur = 0

      // Names
      ctx.fillStyle = '#ffffff'
      ctx.font = '600 18px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(senderName, 220, 435)
      ctx.fillText(receiverName, 580, 435)

      // Title
      ctx.fillStyle = '#ffffff'
      ctx.font = '700 32px Playfair Display, serif'
      ctx.textAlign = 'center'
      ctx.fillText('SoulBound', 400, 550)

      // Subtitle
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.font = '14px Inter, sans-serif'
      ctx.fillText('Proof of Connection • Immutable Bond', 400, 580)

      // Date
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = '12px Inter, sans-serif'
      ctx.fillText(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), 400, 610)

      // Border frame
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 1
      ctx.strokeRect(30, 30, 740, 740)

      // Corner decorations
      const corners = [
        [40, 40],
        [760, 40],
        [40, 760],
        [760, 760],
      ]
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle = 'rgba(255, 105, 180, 0.3)'
        ctx.beginPath()
        ctx.arc(cx, cy, 3, 0, Math.PI * 2)
        ctx.fill()
      })

      // Export
      resolve(canvas.toDataURL('image/png'))
    })
  })
}

function drawHeart(ctx, x, y, size, color) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y + size / 4)
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4)
  ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size)
  ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4)
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4)
  ctx.fill()
  ctx.restore()
}

/**
 * React component that shows the canvas generation process with animation
 */
export default function CanvasGenerator({ senderAvatar, receiverAvatar, senderName, receiverName, onComplete }) {
  const canvasRef = useRef(null)
  const [generating, setGenerating] = useState(true)
  const [imageData, setImageData] = useState(null)

  useEffect(() => {
    const timer = setTimeout(async () => {
      const data = await generateCoupleImage(senderAvatar, receiverAvatar, senderName, receiverName)
      setImageData(data)
      setGenerating(false)
      if (onComplete) onComplete(data)
    }, 2000)

    return () => clearTimeout(timer)
  }, [senderAvatar, receiverAvatar, senderName, receiverName, onComplete])

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative w-32 h-32 mb-6">
          {/* Spinning rings */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-500 animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500 animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          />
          <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-red-400 animate-spin" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl animate-pulse">💖</span>
          </div>
        </div>
        <p className="text-white/60 text-sm animate-pulse">Generating your SoulBound image...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {imageData && (
        <img
          src={imageData}
          alt="SoulBound Couple NFT"
          className="w-80 h-80 rounded-2xl shadow-2xl shadow-pink-500/20 border border-white/10"
        />
      )}
    </div>
  )
}
