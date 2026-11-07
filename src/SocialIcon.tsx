import type { ReactElement } from 'react'
import type { SocialId } from './content'

// Iconos de redes sociales en SVG (heredan el color del texto con currentColor)
const paths: Record<SocialId, ReactElement> = {
  linkedin: (
    <g fill="currentColor">
      <circle cx="5" cy="5" r="2.1" />
      <rect x="3" y="8.6" width="4" height="12" rx="0.6" />
      <path d="M9.6 8.6h3.8v1.7c.6-1.1 2-2 3.9-2 3.4 0 4.1 2.2 4.1 5.1v7.2h-4v-6.4c0-1.5-.1-3-1.9-3-1.9 0-2.1 1.4-2.1 2.9v6.5h-3.8z" />
    </g>
  ),
  github: (
    <path
      fill="currentColor"
      transform="scale(1.5)"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
    />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </g>
  ),
  email: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </g>
  ),
}

export function SocialIcon({ id, size = 18 }: { id: SocialId; size?: number }) {
  return (
    <svg className="social-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {paths[id]}
    </svg>
  )
}
