'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

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
  const prevTimeRef = useRef<TimeRemaining>(timeRemaining)

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
    const initial = calculateTimeRemaining()
    setTimeRemaining(initial)
    prevTimeRef.current = initial

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(prevTime => {
        const newTime = calculateTimeRemaining()
        prevTimeRef.current = prevTime
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const FlipCard = ({ digit, shouldFlip }: { digit: string; shouldFlip: boolean }) => (
    <div
      style={{
        position: 'relative',
        width: '60px',
        height: '80px',
        perspective: '300px',
      }}
    >
      {/* Card container */}
      <div
        key={shouldFlip ? digit : undefined}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: '#2d2d2d',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '56px',
          fontWeight: 700,
          color: '#fff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          animation: shouldFlip ? 'flip 0.6s ease-out' : 'none',
        }}
      >
        {digit}
        {/* Divider line */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        />
      </div>
    </div>
  )

  const TimeUnit = ({
    value,
    prevValue,
    label,
  }: {
    value: number
    prevValue: number
    label: string
  }) => {
    const digits = String(value).padStart(2, '0').split('')
    const prevDigits = String(prevValue).padStart(2, '0').split('')

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <FlipCard digit={digits[0]} shouldFlip={digits[0] !== prevDigits[0]} />
          <FlipCard digit={digits[1]} shouldFlip={digits[1] !== prevDigits[1]} />
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
        @keyframes flip {
          0% {
            transform: rotateX(0deg);
          }
          50% {
            transform: rotateX(-90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
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
            maxWidth: '720px',
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
            <TimeUnit
              value={timeRemaining.days}
              prevValue={prevTimeRef.current.days}
              label="Days"
            />
            <TimeUnit
              value={timeRemaining.hours}
              prevValue={prevTimeRef.current.hours}
              label="Hours"
            />
            <TimeUnit
              value={timeRemaining.minutes}
              prevValue={prevTimeRef.current.minutes}
              label="Minutes"
            />
            <TimeUnit
              value={timeRemaining.seconds}
              prevValue={prevTimeRef.current.seconds}
              label="Seconds"
            />
          </div>

          <p
            style={{
              fontSize: '16px',
              color: 'var(--bui-fg-secondary, #666)',
              marginTop: '32px',
            }}
          >
            While you wait make sure you&apos;ve completed<br />
            the{' '}
            <Link
              href="/getting-started"
              style={{
                color: 'var(--bui-bg-solid, #1f5493)',
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: '2px solid var(--bui-bg-solid, #1f5493)',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Getting Started checklist
            </Link>
            !
          </p>
        </div>
      </div>
    </>
  )
}
