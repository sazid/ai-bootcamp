import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders the board heading', () => {
    expect(App().props.children.props.children).toBe('Kanban board')
  })
})
