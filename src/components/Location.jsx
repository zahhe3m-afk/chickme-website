import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMagnetic from '../hooks/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/chick.me.ae',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="white"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
      </svg>
    ),
  },
  {
    label: 'Snapchat',
    href: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 6 5 6 8v1c-2 0-3 1-3 2s1 2 2 2c.5 2 2 3 3 3.5-.5.5-2 1-4 1.5 0 .5 2 1 4 1h8c2 0 4-.5 4-1-2-.5-3.5-1-4-1.5 1-.5 2.5-1.5 3-3.5 1 0 2-.7 2-2s-1-2-3-2V8c0-3-2-6-6-6z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
        <path d="M9 10c0 5 3.5 7.5 7.4 5.4"/>
      </svg>
    ),
  },
]

export default function Location() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const orderBtnRef = useMagnetic(0.28)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -55,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
      gsap.from(rightRef.current, {
        x: 55,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="location"
      ref={sectionRef}
      style={{
        background: '#141414',
        padding: '120px 0',
        scrollMarginTop: 80,
        overflow: 'hidden',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .location-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .location-right { min-height: 280px !important; }
        }
      `}</style>

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        <div
          className="location-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}
        >
          {/* Left Column — Contact Info */}
          <div ref={leftRef}>
            <div
              style={{
                color: '#ffe600',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              FIND US
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                color: '#ffffff',
                marginTop: 8,
                marginBottom: 32,
                lineHeight: 1.1,
              }}
            >
              Come Say Hello
            </h2>

            {/* Location Pin */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 28, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                  Coming Soon — UAE
                </div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: 2 }}>
                  Exact address dropping soon
                </div>
              </div>
            </div>

            {/* Clock */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 28, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                  Daily 10 AM — 12 AM
                </div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: 2 }}>
                  We stay up late for you
                </div>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 28, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: 'rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="2,4 12,13 22,4"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                  info@chickme.ae
                </div>
                <div style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', marginTop: 2 }}>
                  Slide into our inbox
                </div>
              </div>
            </div>

            {/* Social Icons Row */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: 44,
                    height: 44,
                    background: 'rgba(255,255,255,0.07)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    textDecoration: 'none',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Order Now CTA — Magnetic */}
            <a
              ref={orderBtnRef}
              href="#menu"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{
                display: 'inline-block',
                background: '#ff002b',
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: 9999,
                fontFamily: 'var(--font-secondary)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textDecoration: 'none',
              }}
            >
              View The Menu
            </a>
          </div>

          {/* Right Column — Storefront Image */}
          <div
            ref={rightRef}
            className="location-right"
            style={{ borderRadius: 20, minHeight: 480, overflow: 'hidden', width: '100%', maxWidth: '100%' }}
          >
            <img
              src="/images/location-store.png"
              alt="Find Us"
              style={{ width: '100%', height: '100%', minHeight: 480, objectFit: 'cover', display: 'block', borderRadius: 20 }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
