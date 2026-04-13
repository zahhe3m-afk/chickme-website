import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

// --- Static data hoisted to module level (rendering-hoist-jsx, js-cache-property-access) ---

const pills = [
  {
    label: '😎 Cool Vibes',
    style: {
      top: '24px',
      left: '-24px',
      transform: 'rotate(-6deg)',
      background: '#ffffff',
      color: '#141414',
    },
  },
  {
    label: '🔥 Bold Taste',
    style: {
      top: '50%',
      right: '-24px',
      transform: 'translateY(-50%) rotate(3deg)',
      background: '#ffe600',
      color: '#141414',
    },
  },
  {
    label: '❤️ UAE Born',
    style: {
      bottom: '32px',
      left: '-16px',
      transform: 'rotate(-3deg)',
      background: '#ffffff',
      color: '#141414',
    },
  },
]

const stats = [
  { value: '15+', label: 'Menu Items' },
  { value: '15 AED', label: 'Starting Price' },
  { value: '100%', label: 'Fresh Daily' },
]

const paragraphs = [
  "Chickme isn't just another chicken spot. We're a vibe, a culture, a whole mood. Born in the UAE with flavours loud enough to turn heads and prices low enough to keep you coming back.",
  'Every piece is fried to golden perfection — crispy outside, juicy inside. No shortcuts, no compromises. Just real food made with real energy for real people.',
  'From the sizzle in the kitchen to the buzz on the street, Chickme is where bold meets bold. Welcome to the flock.',
]

// --- Style objects hoisted to module level to prevent per-render allocation ---

const pillBaseStyle = {
  position: 'absolute',
  padding: '8px 16px',
  borderRadius: 9999,
  fontFamily: 'var(--font-secondary)',
  fontWeight: 700,
  fontSize: '0.85rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
  whiteSpace: 'nowrap',
  zIndex: 2,
}

const paraStyle = {
  color: 'rgba(255,255,255,0.65)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.98rem',
  lineHeight: 1.7,
  marginBottom: 16,
}

const statsRowStyle = {
  marginTop: 40,
  display: 'flex',
  gap: 40,
  flexWrap: 'wrap',
}

const statValueStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(2rem, 4vw, 2.8rem)',
  color: '#ffe600',
  lineHeight: 1,
}

const statLabelStyle = {
  fontFamily: 'var(--font-secondary)',
  fontSize: '0.8rem',
  color: 'rgba(255,255,255,0.5)',
  marginTop: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

// Mobile styles injected once as a static string (rendering-hoist-jsx)
const mobileStyles = `
  @media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
    .about-left-tag { display: none !important; }
    .about-photo { min-height: 260px !important; }
    .about-photo img { min-height: 260px !important; }
  }
`

export default function About() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const pillRefs = useRef([])
  const statRefs = useRef([])

  useGSAP(
    () => {
      // Left column slides in from left
      gsap.from(leftRef.current, {
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top 82%',
        },
      })

      // Right column slides in from right
      gsap.from(rightRef.current, {
        x: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 82%',
        },
      })

      // Pills stagger up
      gsap.from(pillRefs.current.filter(Boolean), {
        y: 20,
        opacity: 0,
        stagger: 0.12,
        duration: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top 75%',
        },
      })

      // Stats stagger up
      gsap.from(statRefs.current.filter(Boolean), {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 65%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: '#141414',
        padding: '120px 0',
        scrollMarginTop: 80,
        overflow: 'hidden',
      }}
    >
      {/* Container */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        {/* Two-column grid */}
        <div
          className="about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'center',
          }}
        >
          {/* LEFT COLUMN */}
          <div ref={leftRef} style={{ position: 'relative' }}>
            {/* Photo card */}
            <div
              className="about-photo"
              style={{
                borderRadius: 20,
                minHeight: 480,
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {/* Our Story photo */}
              <img
                src="/images/about-hero.png"
                alt="Our Story"
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: 480,
                  objectFit: 'cover',
                  borderRadius: 20,
                  display: 'block',
                }}
              />

              {/* Floating tag pills — use ternary per rendering-conditional-render */}
              {pills.map((pill, i) => (
                <div
                  key={pill.label}
                  className="about-left-tag"
                  ref={(el) => { pillRefs.current[i] = el }}
                  style={{ ...pillBaseStyle, ...pill.style }}
                >
                  {pill.label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div ref={rightRef}>
            {/* Section label */}
            <p
              style={{
                color: '#ffe600',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 700,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                margin: 0,
              }}
            >
              OUR STORY
            </p>

            {/* Heading */}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
                color: '#ffffff',
                lineHeight: 1.1,
                margin: '16px 0 24px',
              }}
            >
              Not Just Chicken.{' '}
              <span style={{ color: '#ffe600', display: 'block' }}>
                It&apos;s a Vibe.
              </span>
            </h2>

            {/* Body paragraphs */}
            {paragraphs.map((text, i) => (
              <p key={i} style={paraStyle}>
                {text}
              </p>
            ))}

            {/* Stats row */}
            <div style={statsRowStyle}>
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  ref={(el) => { statRefs.current[i] = el }}
                >
                  <div style={statValueStyle}>{stat.value}</div>
                  <div style={statLabelStyle}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile responsive styles — static string, no re-allocation each render */}
      <style>{mobileStyles}</style>
    </section>
  )
}
