import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from '../App'

describe('App', () => {
  it('renders dashboard title when logged out', () => {
    const { getByText } = render(<App />)
    expect(getByText('AI Personal Dashboard')).toBeTruthy()
  })
})
