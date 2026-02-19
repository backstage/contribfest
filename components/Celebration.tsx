'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CelebrationProps {
  onClose?: () => void
}

export function Celebration({ onClose }: CelebrationProps) {
  const router = useRouter()
  const [particles, setParticles] = useState<Array<{ id: number; left: number; bottom: number; delay: number; size: number; rotation: number; image: string }>>([])

  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
    const images = [
      `${basePath}/img/astronaut_flying_drk.png`,
      `${basePath}/img/astronaut_standing_drk.png`,
      `${basePath}/img/community_avocado_drk.png`,
      `${basePath}/img/community_organizer_drk.png`,
      `${basePath}/img/contentalicious_drk.png`,
      `${basePath}/img/looking_drk.png`,
      `${basePath}/img/love_backstage_drk.png`,
      `${basePath}/img/walking_drk.png`,
      `${basePath}/img/waving_drk.png`,
    ]
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 96,
      bottom: Math.random() * 8,
      delay: Math.random() * 1.5,
      size: 40 + Math.floor(Math.random() * 24),
      rotation: Math.random() * 40 - 20,
      image: images[Math.floor(Math.random() * images.length)],
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    if (!onClose) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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
            bottom: `${particle.bottom}%`,
            transform: 'translateY(-110vh)',
            animation: `fall 2s ease-in ${particle.delay}s forwards`,
            opacity: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={particle.image} alt="" width={particle.size} height={particle.size} style={{ objectFit: 'contain', transform: `rotate(${particle.rotation}deg)` }} />
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
        <div style={{ marginBottom: '24px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/img/waving_drk.png`} alt="Bowie celebrating" width={96} height={96} style={{ objectFit: 'contain' }} />
        </div>
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
            Go to Issues
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
            opacity: 0;
            transform: translateY(-110vh);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
