// Temporary page for choosing a column and card design. Delete once a design is picked.
import { useState } from 'react'
import { type Card, COLUMNS, SAMPLE_STATE } from './board'
import './styles.css'
import './variations.css'

const cards = SAMPLE_STATE.cards.filter((c) => c.column === 'doing')

// Current card (design B), so option 1 only changes the column.
function StackedCard({ card }: { card: Card }) {
  return (
    <li className="card">
      <span className="card-title">{card.title}</span>
      <span className="card-footer">
        <button type="button" className="move-button" aria-label={`Move "${card.title}" to To do`}><span aria-hidden="true">←</span> To do</button>
        <button type="button" className="move-button move-next" aria-label={`Move "${card.title}" to Done`}>Done <span aria-hidden="true">→</span></button>
      </span>
    </li>
  )
}

// Title-only card with one Move button that opens a list of target columns.
function CompactCard({ card }: { card: Card }) {
  const [open, setOpen] = useState(false)
  const menuId = `menu-${card.id}`
  return (
    <li className="v-card">
      <span className="v-title">{card.title}</span>
      <span className="v-move">
        <button
          type="button"
          className="v-move-button"
          aria-label={`Move "${card.title}"`}
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        >
          Move <span aria-hidden="true">▾</span>
        </button>
        {open && (
          <ul id={menuId} className="v-menu" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
            {COLUMNS.filter((c) => c.id !== card.column).map((c) => (
              <li key={c.id}><button type="button" className="v-menu-item" onClick={() => setOpen(false)}>Move to {c.title}</button></li>
            ))}
          </ul>
        )}
      </span>
    </li>
  )
}

const options = [
  { id: '1', name: '1 · Sunken columns', note: 'Current cards, columns sit on the page tone.', columnClass: 'v-column-sunken', Card: StackedCard },
  { id: '2', name: '2 · Title-only cards', note: 'White columns, compact cards with one Move button.', columnClass: '', Card: CompactCard },
  { id: '3', name: '3 · Both', note: 'Sunken columns with compact white cards.', columnClass: 'v-column-sunken v-cards-white', Card: CompactCard },
]

export function Variations() {
  return (
    <main className="app">
      <h1>Board variations</h1>
      <p className="v-page-note">Temporary page. Each option shows the Doing column. Buttons here do not change the board.</p>
      <div className="board">
        {options.map(({ id, name, note, columnClass, Card }) => (
          <div key={id} data-testid={`variation-${id}`}>
            <h2 className="v-option-name">{name}</h2>
            <p className="v-option-note">{note}</p>
            <section className={`column ${columnClass}`} aria-label={`${name}: Doing`}>
              <h3 className="column-title">Doing <span className="count">{cards.length}</span></h3>
              <ul className="cards">
                {cards.map((card) => <Card key={card.id} card={card} />)}
              </ul>
            </section>
          </div>
        ))}
      </div>
    </main>
  )
}
