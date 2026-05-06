import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import useMagnetic from '../hooks/useMagnetic'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Why Us', href: '#whyus' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Find Us', href: '#location' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 768px)').matches
      : false
  )
  const overlayRef = useRef(null)
  const linkRefs = useRef([])
  const orderBtnOverlayRef = useRef(null)
  const orderBtnRef = useMagnetic(0.28)

  // Scroll detection
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY >= 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile detection
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Lock body scroll when overlay open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // GSAP stagger animation for mobile overlay links
  useEffect(() => {
    if (menuOpen && isMobile) {
      const targets = [...linkRefs.current, orderBtnOverlayRef.current].filter(Boolean)
      gsap.fromTo(
        targets,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0 0 0)',
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.1,
        }
      )
    }
  }, [menuOpen, isMobile])

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // -- Styles --

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    background: scrolled ? 'rgba(20,20,20,0.92)' : 'transparent',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
    transition: 'all 0.35s ease',
  }

  const innerStyle = {
    maxWidth: 1280,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: scrolled ? '0 32px' : '0 32px',
    height: scrolled ? 68 : 80,
    transition: 'all 0.35s ease',
  }

  const logoStyle = {
    width: scrolled ? 280 : 300,
    height: 'auto',
    transition: 'width 0.35s ease',
    display: 'block',
  }

  const desktopLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  }

  const linkStyle = {
    fontFamily: 'var(--font-secondary)',
    fontWeight: 600,
    fontSize: '0.82rem',
    color: '#ffffff',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    transition: 'color 200ms ease',
    cursor: 'pointer',
  }

  const orderBtnStyle = {
    background: '#ff002b',
    color: '#ffffff',
    padding: '10px 24px',
    borderRadius: 9999,
    border: 'none',
    fontFamily: 'var(--font-secondary)',
    fontWeight: 700,
    fontSize: '0.82rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    cursor: 'pointer',
    transition: 'transform 200ms ease, box-shadow 200ms ease',
    textDecoration: 'none',
    display: 'inline-block',
  }

  // Hamburger
  const hamburgerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    width: 48,
    height: 48,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    zIndex: 1001,
    position: 'relative',
  }

  const lineBase = {
    width: 24,
    height: 2.5,
    background: '#ffffff',
    borderRadius: 2,
    transition: 'transform 0.3s ease, opacity 0.3s ease',
    transformOrigin: 'center',
  }

  const line1 = menuOpen
    ? { ...lineBase, transform: 'translateY(8.5px) rotate(45deg)' }
    : lineBase

  const line2 = menuOpen
    ? { ...lineBase, opacity: 0 }
    : lineBase

  const line3 = menuOpen
    ? { ...lineBase, transform: 'translateY(-8.5px) rotate(-45deg)' }
    : lineBase

  // Mobile overlay
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 999,
    background: '#ff002b',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    opacity: menuOpen ? 1 : 0,
    pointerEvents: menuOpen ? 'auto' : 'none',
    transition: 'opacity 0.3s ease',
  }

  const mobileLinkStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    color: '#ffffff',
    textDecoration: 'none',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.04em',
    clipPath: 'inset(100% 0 0 0)',
    opacity: 0,
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 56,
    padding: '0 8px',
  }

  const mobileOrderBtnStyle = {
    background: '#ffe600',
    color: '#141414',
    padding: '14px 36px',
    borderRadius: 9999,
    border: 'none',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    cursor: 'pointer',
    marginTop: 8,
    textDecoration: 'none',
    display: 'inline-block',
    clipPath: 'inset(100% 0 0 0)',
    opacity: 0,
  }

  return (
    <>
      <nav style={navStyle}>
        <div style={innerStyle}>
          {/* Logo */}
          <a href="#hero" onClick={(e) => handleLinkClick(e, '#hero')}>
            <img
              src="/images/logo-01.svg"
              alt="Chickme"
              style={logoStyle}
            />
          </a>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={desktopLinksStyle}>
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={linkStyle}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffe600' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#ffffff' }}
                >
                  {link.label}
                </a>
              ))}
              <a
                ref={orderBtnRef}
                href="#menu"
                style={orderBtnStyle}
                onClick={(e) => handleLinkClick(e, '#menu')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,0,43,0.45)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Order Now
              </a>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              style={hamburgerStyle}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span style={line1} />
              <span style={line2} />
              <span style={line3} />
            </button>
          )}
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      {isMobile && (
        <div ref={overlayRef} style={overlayStyle}>
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              ref={(el) => { linkRefs.current[i] = el }}
              href={link.href}
              style={mobileLinkStyle}
              onClick={(e) => handleLinkClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            ref={orderBtnOverlayRef}
            href="#menu"
            style={mobileOrderBtnStyle}
            onClick={(e) => handleLinkClick(e, '#menu')}
          >
            Order Now
          </a>
        </div>
      )}
    </>
  )
}
