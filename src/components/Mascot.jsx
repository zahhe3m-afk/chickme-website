/**
 * Mascot — Chickme SVG chicken character
 * Extracted from chickme-v2.html prototype.
 * Props:
 *   width  (number, default 100)
 *   height (number, default 110)
 *   className (string)
 */
export default function Mascot({ width = 100, height = 110, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 220"
      fill="white"
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      {/* Head outline */}
      <path d="M100 45 C60 45 35 75 35 110 C35 120 38 128 42 134 L38 142 C36 146 34 150 36 153 C38 156 42 155 46 153 L52 148 C60 155 72 160 85 162 L82 170 C80 176 84 180 90 178 L98 174 L100 178 L102 174 L110 178 C116 180 120 176 118 170 L115 162 C128 160 140 155 148 148 L154 153 C158 155 162 156 164 153 C166 150 164 146 162 142 L158 134 C162 128 165 120 165 110 C165 75 140 45 100 45Z" />
      {/* Comb / crown */}
      <path d="M100 10 C95 10 92 20 90 30 C88 20 82 15 80 20 C78 25 85 35 90 40 L110 40 C115 35 122 25 120 20 C118 15 112 20 110 30 C108 20 105 10 100 10Z" fill="#ff002b" />
      {/* Sunglasses frame */}
      <rect x="45" y="82" width="110" height="40" rx="8" fill="#ff002b" />
      {/* Left lens */}
      <rect x="48" y="85" width="48" height="34" rx="6" fill="#cc0022" opacity="0.9" />
      {/* Right lens */}
      <rect x="104" y="85" width="48" height="34" rx="6" fill="#cc0022" opacity="0.9" />
      {/* Bridge */}
      <rect x="96" y="92" width="8" height="8" rx="2" fill="#ff002b" />
      {/* Left star eye */}
      <path d="M72 102 L74 96 L76 102 L82 104 L76 106 L74 112 L72 106 L66 104Z" fill="#ffe600" />
      {/* Right star eye */}
      <path d="M128 102 L130 96 L132 102 L138 104 L132 106 L130 112 L128 106 L122 104Z" fill="#ffe600" />
      {/* Beak */}
      <path d="M92 128 L100 122 L108 128 L104 138 L96 138Z" fill="#ff002b" />
      {/* Wattle */}
      <ellipse cx="100" cy="148" rx="8" ry="6" fill="#ff002b" />
    </svg>
  )
}
