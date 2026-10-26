import type { ReactNode } from 'react'

export type IconName = 'home' | 'answers' | 'settings' | 'reply' | 'delivery' | 'pickup' | 'after' | 'search' | 'arrow' | 'products'

const paths: Record<IconName, ReactNode> = {
  products: <><path d="M3.5 7 12 3l8.5 4v10L12 21l-8.5-4Z"/><path d="M3.5 7 12 11l8.5-4M12 11v10" /></>,
  home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-6h6v6" /></>,
  answers: <><path d="M7 4h13v16H7zM4 7v14h13" /><path d="M10 9h7M10 12h7M10 15h5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.7Z" transform="translate(-1 -1)" /></>,
  reply: <><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8 8 0 0 1-3-.6L4 20l1.4-4a7 7 0 0 1-1.4-4.5A7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" /><path d="M8 12h8m-3-3 3 3-3 3" /></>,
  delivery: <><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.5" /><circle cx="18" cy="18" r="1.5" /><path d="M6 10h5m-5 3h4" /></>,
  pickup: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  after: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
}

export default function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return <svg className="icon" aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}
