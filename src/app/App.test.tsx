import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('app shell', () => {
  it('shows the ORBITA workspace and a single primary navigation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /orbita assistant/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getAllByRole('navigation')).toHaveLength(1)
    expect(document.querySelector('.app-frame')).toHaveAttribute('data-app-base', '/orbita-assistant/')
  })
})
