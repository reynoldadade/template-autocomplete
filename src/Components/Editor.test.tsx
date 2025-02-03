import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import EditorWrapper from './Editor'
import userEvent from '@testing-library/user-event'
import axios from 'axios'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('Editor', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('renders the editor', () => {
    ;(axios.get as jest.Mock).mockResolvedValue({
      data: [
        { score: 1, word: 'apple' },
        { score: 2, word: 'orange' },
      ],
    })
    render(<EditorWrapper />)
    expect(screen.getByText('Start creating!')).toBeInTheDocument()
  })
})
