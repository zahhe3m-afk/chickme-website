import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Hoisted outside component — static data, never changes
const ITEMS = [
  { label: 'Brand Spread', bg: 'linear-gradient(135deg, #ff002b 0%, #ff2760 100%)', span: 'row' },
  { label: 'Packaging', bg: 'linear-gradient(135deg, #ffe600 0%, #ffec66 100%)', span: 'none' },
  { label: 'The Team', bg: 'linear-gradient(135deg, #ff2760 0%, #ff5f91 100%)', span: 'none' },
  { label: 'Billboard', bg: 'linear-gradient(135deg, #141414 0%, #2a2a2a 100%)', span: 'col', border: '1px solid rgba(255,255,255,0.1)' },
  { label: 'Social Media', bg: 'linear-gradient(135deg, #ff002b 0%, #ff5f91 100%)', span: 'none' },
  { label: 'Meal Box', bg: 'linear-gradient(135deg, #ffe600 0%, #ff002b 100%)', span: 'none' },
]

// Hoisted static JSX — media query string never changes, avoids recreating style node each render
const RESPONSIVE_STYLES = `
  @media (max-width: 768px) {
    .gallery-grid { grid-template-columns: 1fr 1fr !important; }
    .gallery-row-span { grid-row: span 1 !important; min-height: 200px !important; }
    .gallery-col-span { grid-column: span 2 !important; }
  }
`

export default function Gallery() {
  const sectionRef = useRef(null)

  // Use fixed-size ref arrays indexed by position — avoids clearing during render (side-effect anti-pattern)
  const innerRefs = useRef(new Array(ITEMS.length).fill(null))
  const overlayRefs = useRef(new Array(ITEMS.length).fill(null))
  const labelRefs = useRef(new Array(ITEMS.length).fill(null))

  // Stable ref-setter callbacks via useCallback so they don't cause re-renders when passed as ref props
  const makeInnerRef = useCallback((index) => (el) => { innerRefs.current[index] = el }, [])
  const makeOverlayRef = useCallback((index) => (el) => { overlayRefs.current[index] = el }, [])
  const makeLabelRef = useCallback((index) => (el) => { labelRefs.current[index] = el }, [])

  // Track which item is tapped open on mobile
  const tappedRef = useRef(-1)

  const handleEnter = useCallback((index) => {
    gsap.to(innerRefs.current[index], { scale: 1.06, duration: 0.4, ease: 'power2.out' })
    gsap.to(overlayRefs.current[index], { opacity: 1, duration: 0.3 })
    gsap.to(labelRefs.current[index], { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' })
  }, [])

  const handleLeave = useCallback((index) => {
    gsap.to(innerRefs.current[index], { scale: 1, duration: 0.5, ease: 'power2.out' })
    gsap.to(overlayRefs.current[index], { opacity: 0, duration: 0.3 })
    gsap.to(labelRefs.current[index], { y: 16, opacity: 0, duration: 0.3 })
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.batch('.gallery-item', {
        onEnter: (batch) => {
          gsap.from(batch, {
            opacity: 0,
            y: 50,
            scale: 0.92,
            stagger: 0.08,
            ease: 'back.out(1.4)',
            duration: 0.5,
          })
        },
        start: 'top 88%',
        once: true,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="gallery"
      ref={sectionRef}
      style={{
        background: '#141414',
        padding: '120px 0',
        scrollMarginTop: 80,
      }}
    >
      {/* Static style block — hoisted string constant, not recreated each render */}
      <style>{RESPONSIVE_STYLES}</style>

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p
            style={{
              color: '#ffe600',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              margin: 0,
            }}
          >
            GALLERY
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: '#ffffff',
              marginTop: 8,
              marginBottom: 0,
              lineHeight: 1.1,
            }}
          >
            The Vibe.
          </h2>
        </div>

        {/* Bento Grid */}
        <div
          className="gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {ITEMS.map((item, index) => {
            const isRowSpan = item.span === 'row'
            const isColSpan = item.span === 'col'

            const gridStyle = isRowSpan
              ? { gridRow: 'span 2', minHeight: 440 }
              : { minHeight: 200 }
            if (isColSpan) gridStyle.gridColumn = 'span 2'

            return (
              <GalleryItem
                key={item.label}
                item={item}
                index={index}
                isRowSpan={isRowSpan}
                isColSpan={isColSpan}
                gridStyle={gridStyle}
                innerRef={makeInnerRef(index)}
                overlayRef={makeOverlayRef(index)}
                labelRef={makeLabelRef(index)}
                onEnter={handleEnter}
                onLeave={handleLeave}
                tappedRef={tappedRef}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Extracted as a named component so React can diff it properly and event handlers stay stable per item
function GalleryItem({
  item,
  index,
  isRowSpan,
  isColSpan,
  gridStyle,
  innerRef,
  overlayRef,
  labelRef,
  onEnter,
  onLeave,
  tappedRef,
}) {
  return (
    <div
      className={[
        'gallery-item',
        isRowSpan ? 'gallery-row-span' : '',
        isColSpan ? 'gallery-col-span' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        border: item.border || 'none',
        ...gridStyle,
      }}
      onMouseEnter={() => onEnter(index)}
      onMouseLeave={() => onLeave(index)}
      onTouchStart={(e) => {
        e.preventDefault()
        const prev = tappedRef.current
        if (prev === index) {
          // Second tap — close
          onLeave(index)
          tappedRef.current = -1
        } else {
          // Close previous
          if (prev !== -1) onLeave(prev)
          onEnter(index)
          tappedRef.current = index
        }
      }}
    >
      {/* Inner zoom layer */}
      <div
        ref={innerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          background: item.bg,
        }}
      />

      {/* Logo watermark */}
      <img
        src="/images/logo-01.svg"
        alt=""
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          opacity: 0.12,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Gradient overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)',
          opacity: 0,
          zIndex: 2,
        }}
      />

      {/* Label */}
      <span
        ref={labelRef}
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          fontFamily: 'var(--font-display)',
          color: '#ffffff',
          fontSize: '1.1rem',
          transform: 'translateY(16px)',
          opacity: 0,
          zIndex: 3,
          lineHeight: 1,
        }}
      >
        {item.label}
      </span>
    </div>
  )
}
