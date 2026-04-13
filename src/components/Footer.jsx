import { memo } from 'react';

// Static data hoisted to module level — no recreation on re-render (rendering-hoist-jsx)
const MENU_LINKS = ['Fried Chicken', 'Loaded Burgers', 'Fresh Pizzas', 'Cold Drinks'];

const COMPANY_LINKS = [
  { label: 'About Us', href: '#about' },
  { label: 'Why Chickme', href: '#why-us' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Careers', href: '#careers' },
];

const SOCIAL_LINKS = [
  { label: '@chick.me.ae', href: 'https://instagram.com/chick.me.ae' },
  { label: 'TikTok', href: '#' },
  { label: 'Snapchat', href: '#' },
  { label: 'WhatsApp', href: '#' },
];

// Shared style objects hoisted to module level — no recreation on re-render (rendering-hoist-jsx)
const COLUMN_HEADER_STYLE = {
  fontFamily: 'var(--font-secondary)',
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'rgba(255,255,255,0.5)',
  margin: '0 0 16px',
};

const LINK_STYLE = {
  display: 'flex',
  alignItems: 'center',
  minHeight: 44,
  fontFamily: 'var(--font-body)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '0.9rem',
  opacity: 0.85,
  transition: 'opacity 0.2s ease',
};

const COPYRIGHT_STYLE = {
  fontFamily: 'var(--font-body)',
  color: 'rgba(255,255,255,0.55)',
  fontSize: '0.82rem',
};

// Stable hover handlers hoisted to module level — no new function instances per render
function handleLinkMouseEnter(e) {
  e.currentTarget.style.opacity = '1';
}
function handleLinkMouseLeave(e) {
  e.currentTarget.style.opacity = '0.85';
}

function Footer() {
  return (
    <footer style={{ position: 'relative', overflow: 'hidden', background: '#ff002b', padding: '80px 32px 40px' }}>
      <style>{`
        @media (max-width: 768px) {
          .footer-links { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-bottom { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>

      {/* Star pattern overlay */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}>
        <defs>
          <pattern id="footer-star-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6Z" fill="white"/>
            <circle cx="36" cy="36" r="3" fill="white"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footer-star-pattern)"/>
      </svg>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>

        {/* Top section */}
        <img
          src="/images/logo-01.svg"
          alt="Chickme"
          style={{ width: 220, height: 'auto', display: 'block', margin: '0 auto 16px' }}
        />
        <p style={{
          fontFamily: 'var(--font-display)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '1.1rem',
          textAlign: 'center',
          margin: '0 0 64px',
        }}>
          Fried with Fun!
        </p>

        {/* Three-column links grid */}
        <div
          className="footer-links"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 40,
            marginBottom: 64,
          }}
        >
          {/* Column 1 — Menu */}
          <div>
            <p style={COLUMN_HEADER_STYLE}>Menu</p>
            {MENU_LINKS.map((item) => (
              <a
                key={item}
                href="#menu"
                style={LINK_STYLE}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Column 2 — Company */}
          <div>
            <p style={COLUMN_HEADER_STYLE}>Company</p>
            {COMPANY_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={LINK_STYLE}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Column 3 — Social */}
          <div>
            <p style={COLUMN_HEADER_STYLE}>Social</p>
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={LINK_STYLE}
                onMouseEnter={handleLinkMouseEnter}
                onMouseLeave={handleLinkMouseLeave}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.15)', marginBottom: 32 }} />

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <span style={COPYRIGHT_STYLE}>© 2026 Chickme. A Talal Group International Brand.</span>
          <span style={COPYRIGHT_STYLE}>Made with ❤️ in the UAE</span>
        </div>

      </div>
    </footer>
  );
}

export default memo(Footer);
