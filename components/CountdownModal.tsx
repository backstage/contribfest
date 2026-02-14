'use client'

import { useEffect, useState } from 'react'

interface CountdownModalProps {
  targetDate: Date
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownModal({ targetDate }: CountdownModalProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      }
    }

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining())

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const TimeUnit = ({
    value,
    label,
    max
  }: {
    value: number;
    label: string;
    max: number
  }) => {
    const percentage = (value / max) * 100
    const circumference = 2 * Math.PI * 45 // radius of 45
    const offset = circumference - (percentage / 100) * circumference

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          {/* Background circle */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'rotate(-90deg)',
              width: '100%',
              height: '100%',
            }}
          >
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="var(--bui-border-1, #d5d5d5)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="var(--bui-bg-solid, #1f5493)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 1s ease',
              }}
            />
          </svg>
          {/* Center number */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '36px',
              fontWeight: 700,
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            {String(value).padStart(2, '0')}
          </div>
        </div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--bui-fg-secondary, #666)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
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
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      >
        <div
          style={{
            background: 'var(--bui-bg-app, #f8f8f8)',
            borderRadius: '16px',
            padding: '48px',
            maxWidth: '600px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 700,
              marginBottom: '16px',
              color: 'var(--bui-fg-primary, #000)',
            }}
          >
            ContribFest Coming Soon!
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--bui-fg-secondary, #666)',
              marginBottom: '48px',
              lineHeight: '1.6',
            }}
          >
            The curated issues list will be available on<br />
            <strong>March 26, 2026</strong>
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginBottom: '32px',
            }}
          >
            <TimeUnit value={timeRemaining.days} label="Days" max={365} />
            <TimeUnit value={timeRemaining.hours} label="Hours" max={24} />
            <TimeUnit value={timeRemaining.minutes} label="Minutes" max={60} />
            <TimeUnit value={timeRemaining.seconds} label="Seconds" max={60} />
          </div>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--bui-fg-secondary, #666)',
              marginTop: '32px',
            }}
          >
            While you wait make sure you've completed<br />
            the{' '}
            <a
              href="/getting-started"
              style={{
                color: 'var(--bui-bg-solid, #1f5493)',
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: '2px solid var(--bui-bg-solid, #1f5493)',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              Getting Started checklist
            </a>
            !
          </p>
        </div>
      </div>
    </>
  )
}
