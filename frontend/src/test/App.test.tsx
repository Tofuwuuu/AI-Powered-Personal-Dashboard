import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '../App'

describe('App', () => {
  it('renders dashboard title when logged out', () => {
    const { getByRole } = render(<App />)
    expect(getByRole('heading', { level: 1, name: 'AI Personal Dashboard' })).toBeTruthy()
  })
})
