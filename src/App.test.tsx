import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

// Mock the NetworkSimulator component since it's complex
vi.mock('./components/features/network/NetworkSimulator/NetworkSimulator', () => ({
  NetworkSimulator: ({ className }: { className: string }) => (
    <div data-testid="network-simulator" className={className}>
      Network Simulator Mock
    </div>
  )
}))

describe('App', () => {
  it('renders the main app structure', () => {
    render(<App />)
    
    // Check if the app container exists
    const appElement = document.querySelector('.app')
    expect(appElement).toBeInTheDocument()
    
    // Check if the main element exists
    const mainElement = document.querySelector('.app-main')
    expect(mainElement).toBeInTheDocument()
    
    // Check if NetworkSimulator is rendered
    const networkSimulator = screen.getByTestId('network-simulator')
    expect(networkSimulator).toBeInTheDocument()
    expect(networkSimulator).toHaveClass('network-simulator-container')
  })

  it('renders NetworkSimulator with correct props', () => {
    render(<App />)
    
    const networkSimulator = screen.getByTestId('network-simulator')
    expect(networkSimulator).toBeInTheDocument()
    
    // The props are passed to the mock, so we just verify it renders
    expect(networkSimulator).toHaveTextContent('Network Simulator Mock')
  })
})
