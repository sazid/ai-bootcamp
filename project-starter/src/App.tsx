import { type ReactNode, useSyncExternalStore } from 'react'
import { board, COLUMNS, columnTitle } from './board'
import './styles.css'

export function App() {
  return <BoardScreen><h1>Kanban board</h1></BoardScreen>
}

function BoardScreen({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(board.subscribe, board.getState)

  return (
    <main className="app">
      <header className="app-header">
        {children}
        <div className="toolbar">
          <button type="button" className="button" data-testid="undo" disabled={!board.canUndo()} onClick={() => board.dispatch({ type: 'board.undo' })}>
            <span aria-hidden="true">↶</span> Undo
          </button>
          <button type="button" className="button" data-testid="redo" disabled={!board.canRedo()} onClick={() => board.dispatch({ type: 'board.redo' })}>
            <span aria-hidden="true">↷</span> Redo
          </button>
        </div>
      </header>
      <div className="board">
        {COLUMNS.map((column, i) => {
          const cards = state.cards.filter((c) => c.column === column.id)
          const prev = COLUMNS[i - 1]
          const next = COLUMNS[i + 1]
          return (
            <section key={column.id} className="column" aria-labelledby={`col-${column.id}`} data-testid={`column-${column.id}`}>
              <h2 id={`col-${column.id}`} className="column-title">
                {column.title} <span className="count">{cards.length}</span>
              </h2>
              <ul className="cards">
                {cards.map((card) => (
                  <li key={card.id} className="card" data-testid={`card-${card.id}`}>
                    <span className="card-title">{card.title}</span>
                    <span className="card-footer">
                      {prev && (
                        <button type="button" className="move-button" aria-label={`Move "${card.title}" to ${columnTitle(prev.id)}`} onClick={() => board.dispatch({ type: 'card.move', id: card.id, column: prev.id })}>
                          <span aria-hidden="true">←</span> {prev.title}
                        </button>
                      )}
                      {next && (
                        <button type="button" className="move-button move-next" aria-label={`Move "${card.title}" to ${columnTitle(next.id)}`} onClick={() => board.dispatch({ type: 'card.move', id: card.id, column: next.id })}>
                          {next.title} <span aria-hidden="true">→</span>
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {cards.length === 0 && <p className="empty">No cards</p>}
            </section>
          )
        })}
      </div>
    </main>
  )
}
