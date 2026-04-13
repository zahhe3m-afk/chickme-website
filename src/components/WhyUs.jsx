import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CARDS = [
  { icon: '🌿', title: 'Always Fresh', desc: 'Cooked to order, never pre-made. Every bite is peak freshness — no exceptions.' },
  { icon: '💰', title: 'Wallet Friendly', desc: "Big flavours don't have to cost big money. Chickme starts from just 15 AED." },
  { icon: '🔥', title: 'Bold Flavors', desc: 'We don\'t do bland. Our seasoning hits different — spicy, smoky, and straight-up addictive.' },
  { icon: '🎉', title: 'Fun Vibes Only', desc: 'Chickme is more than food — it\'s energy. Come for the chicken, stay for the vibe.' },
]

export default function WhyUs() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardRefs = useRef([])
  const iconRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      })

      gsap.from(cardRefs.current.filter(Boolean), {
        opacity: 0,
        y: 50,
        stagger: 0.12,
        ease: 'power3.out',
        duration: 0.7,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  function handleMouseEnter(i) {
    const cardEl = cardRefs.current[i]
    const iconEl = iconRefs.current[i]
    if (cardEl) gsap.to(cardEl, { y: -8, background: 'rgba(255,255,255,0.18)', duration: 0.3, ease: 'power2.out' })
    if (iconEl) gsap.to(iconEl, { rotation: 15, scale: 1.1, duration: 0.25, ease: 'power2.out' })
  }

  function handleMouseLeave(i) {
    const cardEl = cardRefs.current[i]
    const iconEl = iconRefs.current[i]
    if (cardEl) gsap.to(cardEl, { y: 0, background: 'rgba(255,255,255,0.1)', duration: 0.35, ease: 'power2.out' })
    if (iconEl) gsap.to(iconEl, { rotation: 0, scale: 1, duration: 0.35, ease: 'power2.out' })
  }

  return (
    <section
      id="whyus"
      ref={sectionRef}
      style={{
        background: '#ff002b',
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 0',
        scrollMarginTop: 80,
      }}
    >
      {/* Star pattern overlay */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.04,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="whyus-star-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6Z" fill="white" />
            <circle cx="36" cy="36" r="3" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#whyus-star-pattern)" />
      </svg>

      {/* Container */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            textAlign: 'center',
            marginBottom: 64,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              margin: 0,
            }}
          >
            THE REAL DEAL
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#ffffff',
              marginTop: 8,
              marginBottom: 0,
              lineHeight: 1.15,
            }}
          >
            Why Everyone's Clucking About Us
          </h2>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => { cardRefs.current[i] = el }}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onTouchStart={() => handleMouseEnter(i)}
              onTouchEnd={() => handleMouseLeave(i)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 20,
                padding: 32,
                cursor: 'default',
                transition: 'background 0.3s ease, transform 0.3s ease',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Icon container */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: '#ffe600',
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <span
                  ref={(el) => { iconRefs.current[i] = el }}
                  style={{ fontSize: 26, display: 'block' }}
                >
                  {card.icon}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  color: '#ffffff',
                  marginBottom: 8,
                  marginTop: 0,
                }}
              >
                {card.title}
              </h3>

              {/* Desc */}
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
