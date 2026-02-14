'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CelebrationProps {
  onClose?: () => void
}

export function Celebration({ onClose }: CelebrationProps) {
  const router = useRouter()
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; emoji: string }>>([])

  useEffect(() => {
    // Generate random confetti particles with emojis
    const emojis = ['🎉', '🎊', '✨', '🌟', '⭐', '🎈', '🚀', '💪', '👏', '🙌', '🔥', '💯']
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }))
    setParticles(newParticles)
  }, [])

  const handleGoToIssues = () => {
    router.push('/issues')
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease-in',
      }}
    >
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.left}%`,
            top: '-10%',
            fontSize: '24px',
            animation: `fall 3s ease-in ${particle.delay}s`,
            opacity: 0,
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Celebration card */}
      <div
        style={{
          background: 'var(--bui-bg-app, #fff)',
          borderRadius: '16px',
          padding: '48px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          animation: 'scaleIn 0.5s ease-out',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '16px',
            color: 'var(--bui-fg-primary, #000)',
          }}
        >
          Congratulations!
        </h2>
        <p
          style={{
            fontSize: '18px',
            color: 'var(--bui-fg-secondary, #666)',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}
        >
          You&apos;ve completed all the setup steps! You&apos;re ready to start contributing to Backstage!
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={handleGoToIssues}
            style={{
              padding: '16px 32px',
              background: 'var(--bui-bg-solid, #1f5493)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bui-bg-solid-hover, #164073)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bui-bg-solid, #1f5493)'
            }}
          >
            Go to Issues 🎯
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '16px 32px',
                background: 'var(--bui-bg-app, #f8f8f8)',
                border: '1px solid var(--bui-border-1, #d5d5d5)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: 'var(--bui-fg-primary, #000)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bui-bg-info, #dbeafe)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--bui-bg-app, #f8f8f8)'
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
