import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { board, type BoardStore } from './board'
import { Variations } from './Variations'

declare global {
  interface Window {
    __board?: Pick<BoardStore, 'getState' | 'getLog' | 'dispatch'>
  }
}

if (import.meta.env.DEV) {
  window.__board = { getState: board.getState, getLog: board.getLog, dispatch: board.dispatch }
}

// Temporary: /variations shows design options.
const isVariations = window.location.pathname === '/variations'

createRoot(document.getElementById('root')!).render(<StrictMode>{isVariations ? <Variations /> : <App />}</StrictMode>)
