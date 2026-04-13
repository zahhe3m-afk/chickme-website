import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Card data ───
const CARDS = [
  {
    emoji: '🍗',
    name: 'Fried Chicken',
    desc: 'Golden, crispy, and irresistible',
    tag: 'Best Seller',
    tagBg: '#ffe600',
    tagColor: '#141414',
    topBg: '#ff002b',
    topImg: '/images/menu/fried-chicken.webp',
  },
  {
    emoji: '🍔',
    name: 'Loaded Burgers',
    desc: 'Stacked high with bold flavours',
    tag: 'Popular',
    tagBg: '#ff002b',
    tagColor: '#ffffff',
    topBg: '#ffe600',
    topImg: '/images/menu/burger.webp',
  },
  {
    emoji: '🍕',
    name: 'Fresh Pizzas',
    desc: 'Hot from the oven, never boring',
    tag: 'New',
    tagBg: '#141414',
    tagColor: '#ffffff',
    topBg: '#ff2760',
    topImg: '/images/menu/pizza.webp',
  },
  {
    emoji: '🥤',
    name: 'Cold Drinks',
    desc: 'Chill vibes, refreshing sips',
    tag: 'Refreshing',
    tagBg: '#ffe600',
    tagColor: '#141414',
    topBg: '#141414',
    topImg: '/images/menu/drinks.webp',
    wide: true,
  },
]

// ─── Background words for oversized parallax text ───
const BG_WORDS = ['THE', 'CRUNCH']

// ─── Star pattern for card tops ───
const CardStarPattern = ({ id }) => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }}
    aria-hidden="true"
  >
    <defs>
      <pattern id={id} x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="white" />
        <circle cx="30" cy="30" r="2.5" fill="white" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
)


export default function Menu() {
  const sectionRef = useRef(null)
  const cardRefs = useRef([])
  const emojiRefs = useRef([])
  const bgTextRefs = useRef([])

  // ─── ScrollTrigger.batch entrance ───
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch(cardRefs.current.filter(Boolean), {
        onEnter: (batch) => {
          gsap.from(batch, {
            opacity: 0,
            y: 50,
            scale: 0.92,
            stagger: 0.08,
            ease: 'back.out(1.4)',
            duration: 0.5,
            clearProps: 'transform',
          })
        },
        start: 'top 85%',
        once: true,
      })

      // Oversized background text — slow parallax scrub
      bgTextRefs.current.filter(Boolean).forEach((el, i) => {
        gsap.to(el, {
          y: i === 0 ? -60 : -40,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // ─── 3D Tilt Physics + emoji lift on hover ───
  useEffect(() => {
    const cleanups = cardRefs.current.map((cardEl, i) => {
      if (!cardEl) return null
      const emojiEl = emojiRefs.current[i]

      const onMove = (e) => {
        const rect = cardEl.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -6
        const rotateY = ((x - centerX) / centerX) * 6

        gsap.to(cardEl, {
          rotateX,
          rotateY,
          transformPerspective: 800,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.12)',
          duration: 0.35,
          ease: 'power2.out',
        })

        if (emojiEl) {
          gsap.to(emojiEl, { y: -10, scale: 1.15, duration: 0.35, ease: 'power2.out' })
        }
      }

      const onLeave = () => {
        gsap.to(cardEl, {
          rotateX: 0,
          rotateY: 0,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        })
        if (emojiEl) {
          gsap.to(emojiEl, { y: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
        }
      }

      // Touch tap pulse for mobile
      const onTouchStart = () => {
        gsap.to(cardEl, { scale: 0.96, duration: 0.12, ease: 'power2.out' })
        if (emojiEl) gsap.to(emojiEl, { scale: 1.15, duration: 0.12, ease: 'power2.out' })
      }
      const onTouchEnd = () => {
        gsap.to(cardEl, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' })
        if (emojiEl) gsap.to(emojiEl, { scale: 1, duration: 0.35, ease: 'elastic.out(1, 0.5)' })
      }

      cardEl.addEventListener('mousemove', onMove)
      cardEl.addEventListener('mouseleave', onLeave)
      cardEl.addEventListener('touchstart', onTouchStart, { passive: true })
      cardEl.addEventListener('touchend', onTouchEnd, { passive: true })

      return () => {
        cardEl.removeEventListener('mousemove', onMove)
        cardEl.removeEventListener('mouseleave', onLeave)
        cardEl.removeEventListener('touchstart', onTouchStart)
        cardEl.removeEventListener('touchend', onTouchEnd)
      }
    })

    return () => cleanups.forEach((fn) => fn?.())
  }, [])

  return (
    <section
      id="menu"
      ref={sectionRef}
      style={{
        background: '#ffffff',
        padding: '120px 0',
        scrollMarginTop: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ─── Oversized outline background typography ─── */}
      {BG_WORDS.map((word, i) => (
        <div
          key={word}
          ref={(el) => { bgTextRefs.current[i] = el }}
          aria-hidden="true"
          style={{
            position: 'absolute',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(8rem, 18vw, 16rem)',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(0,0,0,0.04)',
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
            ...(i === 0
              ? { top: '8%', left: '-5%' }
              : { bottom: '5%', right: '-3%' }),
          }}
        >
          {word}
        </div>
      ))}

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ─── Header ─── */}
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p
            style={{
              fontFamily: 'var(--font-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#ff002b',
              margin: 0,
            }}
          >
            THE MENU
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#141414',
              marginTop: 8,
              marginBottom: 0,
              lineHeight: 1.1,
            }}
          >
            What's Cookin'?
          </h2>
        </div>

        {/* ─── Bento Grid ─── */}
        <div
          className="menu-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr 1fr',
            gridTemplateRows: 'auto auto',
            gap: 28,
          }}
        >
          {CARDS.map((card, i) => {
            const isWide = card.wide

            return (
              <div
                key={card.name}
                ref={(el) => { cardRefs.current[i] = el }}
                className={isWide ? 'menu-card-wide' : ''}
                style={{
                  position: 'relative',
                  borderRadius: 24,
                  overflow: 'visible',
                  cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: isWide ? 'row' : 'column',
                  gridColumn: isWide ? 'span 2' : 'span 1',
                  gridRow: 'span 1',
                  minHeight: i === 0 ? 440 : isWide ? 320 : 380,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                  background: '#ffffff',
                }}
              >
                {/* ─── Colored top panel with star pattern + emoji ─── */}
                <div
                  className="menu-card-top"
                  style={{
                    background: card.topBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: isWide ? '0 0 50%' : '0 0 55%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: isWide ? '24px 0 0 24px' : '24px 24px 0 0',
                  }}
                >
                  {card.topImg ? (
                    <img
                      ref={(el) => { emojiRefs.current[i] = el }}
                      src={card.topImg}
                      alt={card.name}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: isWide ? '24px 0 0 24px' : '24px 24px 0 0',
                      }}
                    />
                  ) : (
                    <>
                      <CardStarPattern id={`menu-star-${i}`} />
                      <span
                        ref={(el) => { emojiRefs.current[i] = el }}
                        role="img"
                        aria-label={card.name}
                        style={{
                          fontSize: i === 0 ? 96 : 80,
                          lineHeight: 1,
                          display: 'inline-block',
                          position: 'relative',
                          zIndex: 1,
                          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                        }}
                      >
                        {card.emoji}
                      </span>
                    </>
                  )}
                </div>

                {/* ─── White info panel ─── */}
                <div
                  style={{
                    background: '#ffffff',
                    padding: '24px 28px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    position: 'relative',
                    zIndex: 2,
                    borderRadius: isWide ? '0 24px 24px 0' : '0 0 24px 24px',
                  }}
                >
                  {/* Tag pill */}
                  <span
                    style={{
                      display: 'inline-block',
                      background: card.tagBg,
                      color: card.tagColor,
                      borderRadius: 9999,
                      padding: '5px 12px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: 12,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {card.tag}
                  </span>

                  {/* Name — heavy display font */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                      color: '#141414',
                      margin: 0,
                      lineHeight: 1.1,
                    }}
                  >
                    {card.name}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      color: 'rgba(0,0,0,0.5)',
                      marginTop: 6,
                      marginBottom: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {card.desc}
                  </p>

                  {/* Price */}
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      color: '#ff002b',
                      marginTop: 12,
                      marginBottom: 0,
                    }}
                  >
                    From 15 AED
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Responsive ─── */}
      <style>{`
        @media (max-width: 768px) {
          .menu-grid { grid-template-columns: 1fr !important; }
          .menu-grid > div { grid-column: 1 / -1 !important; }
          .menu-card-wide { flex-direction: column !important; }
          .menu-card-wide .menu-card-top {
            flex: 0 0 45% !important;
            border-radius: 24px 24px 0 0 !important;
          }
        }
      `}</style>
    </section>
  )
}
