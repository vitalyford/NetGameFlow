import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { TechTerm } from './TechTerm'
import { useEducational } from '@/hooks/useEducational'
import { getNetworkExplanation } from '@/utils/networkExplanations'

// Mock the hooks and utilities
vi.mock('@/hooks/useEducational')
vi.mock('@/utils/networkExplanations')

const mockShowPopup = vi.fn()
const mockUseEducational = vi.mocked(useEducational)
const mockGetNetworkExplanation = vi.mocked(getNetworkExplanation)

describe('TechTerm', () => {  beforeEach(() => {
    vi.clearAllMocks()
    mockUseEducational.mockReturnValue({
      showPopup: mockShowPopup,
      hidePopup: vi.fn(),
      currentPopup: null,
    })
  })

  it('renders children when no explanation exists', () => {
    mockGetNetworkExplanation.mockReturnValue(undefined as unknown as ReturnType<typeof getNetworkExplanation>)
    
    render(
      <TechTerm term="unknown-term">
        <span>Test Content</span>
      </TechTerm>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders clickable term when explanation exists', () => {
    const mockExplanation = {
      title: 'Test Term',
      content: 'Test explanation content'
    }
    mockGetNetworkExplanation.mockReturnValue(mockExplanation)
    
    render(
      <TechTerm term="test-term">
        <span>Clickable Term</span>
      </TechTerm>
    )

    const termElement = screen.getByRole('button')
    expect(termElement).toBeInTheDocument()
    expect(termElement).toHaveAttribute('title', 'Click to learn more about test-term')
    expect(screen.getByText('Clickable Term')).toBeInTheDocument()
  })

  it('shows popup when clicked', () => {
    const mockExplanation = {
      title: 'Test Term',
      content: 'Test explanation content'
    }
    mockGetNetworkExplanation.mockReturnValue(mockExplanation)
    
    render(
      <TechTerm term="test-term">
        <span>Clickable Term</span>
      </TechTerm>
    )

    fireEvent.click(screen.getByRole('button'))

    expect(mockShowPopup).toHaveBeenCalledWith({
      id: 'tech-term-test-term',
      title: 'Test Term',
      content: 'Test explanation content'
    })
  })

  it('shows popup when Enter key is pressed', () => {
    const mockExplanation = {
      title: 'Test Term',
      content: 'Test explanation content'
    }
    mockGetNetworkExplanation.mockReturnValue(mockExplanation)
    
    render(
      <TechTerm term="test-term">
        <span>Clickable Term</span>
      </TechTerm>
    )

    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })

    expect(mockShowPopup).toHaveBeenCalledWith({
      id: 'tech-term-test-term',
      title: 'Test Term',
      content: 'Test explanation content'
    })
  })

  it('shows popup when Space key is pressed', () => {
    const mockExplanation = {
      title: 'Test Term',
      content: 'Test explanation content'
    }
    mockGetNetworkExplanation.mockReturnValue(mockExplanation)
    
    render(
      <TechTerm term="test-term">
        <span>Clickable Term</span>
      </TechTerm>
    )

    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' })

    expect(mockShowPopup).toHaveBeenCalledWith({
      id: 'tech-term-test-term',
      title: 'Test Term',
      content: 'Test explanation content'
    })
  })
})
