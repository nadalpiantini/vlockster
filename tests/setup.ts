import '@testing-library/jest-dom'
import * as React from 'react'

// Make React available globally for JSX
global.React = React
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpiar después de cada test
afterEach(() => {
  cleanup()
})

