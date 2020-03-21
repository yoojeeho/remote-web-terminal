import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { TerminalComponent } from '../../index'

test('Renders', async () => {
  const { getByRole } = render(<TerminalComponent server="http://localhost:1234"/>)
  expect(getByRole('heading')).toHaveTextContent('My First Component')
})
