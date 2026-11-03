import { describe, expect, it } from 'vitest'
import { COLUMNS, createBoardStore, SAMPLE_STATE } from './board'

const column = (store: ReturnType<typeof createBoardStore>, id: string) =>
  store.getState().cards.filter((c) => c.column === id).map((c) => c.id)

describe('board store', () => {
  it('has three columns and sample cards in each', () => {
    expect(COLUMNS.map((c) => c.title)).toEqual(['To do', 'Doing', 'Done'])
    const store = createBoardStore()
    for (const c of COLUMNS) expect(column(store, c.id).length).toBeGreaterThan(0)
  })

  it('moves a card to the bottom of another column and logs it', () => {
    const store = createBoardStore()
    expect(store.dispatch({ type: 'card.move', id: 'c1', column: 'doing' }, 'test')).toEqual({ ok: true })
    expect(column(store, 'doing')).toEqual(['c3', 'c4', 'c1'])
    expect(store.getLog()).toMatchObject([{ seq: 1, actor: 'test', command: { type: 'card.move', id: 'c1' } }])
  })

  it('creates and deletes cards', () => {
    const store = createBoardStore()
    store.dispatch({ type: 'card.create', title: '  New card ', column: 'todo' })
    const created = store.getState().cards.at(-1)!
    expect(created).toMatchObject({ title: 'New card', column: 'todo' })
    store.dispatch({ type: 'card.delete', id: created.id })
    expect(store.getState()).toEqual(SAMPLE_STATE)
  })

  it('rejects invalid commands without changing state or the log', () => {
    const store = createBoardStore()
    expect(store.dispatch({ type: 'card.move', id: 'nope', column: 'done' }).ok).toBe(false)
    expect(store.dispatch({ type: 'card.move', id: 'c1', column: 'todo' }).ok).toBe(false)
    expect(store.dispatch({ type: 'card.create', title: '   ', column: 'todo' }).ok).toBe(false)
    expect(store.dispatch({ type: 'card.delete', id: 'nope' }).ok).toBe(false)
    expect(store.dispatch({ type: 'board.undo' }).ok).toBe(false)
    expect(store.getState()).toBe(SAMPLE_STATE)
    expect(store.getLog()).toEqual([])
  })

  it('undoes and redoes through the event log', () => {
    const store = createBoardStore()
    store.dispatch({ type: 'card.move', id: 'c1', column: 'doing' })
    store.dispatch({ type: 'card.move', id: 'c1', column: 'done' })
    store.dispatch({ type: 'board.undo' })
    expect(column(store, 'doing')).toContain('c1')
    store.dispatch({ type: 'board.redo' })
    expect(column(store, 'done')).toContain('c1')
    store.dispatch({ type: 'board.undo' })
    store.dispatch({ type: 'board.undo' })
    expect(store.getState()).toEqual(SAMPLE_STATE)
    expect(store.canUndo()).toBe(false)
    // A new command drops the redo history.
    store.dispatch({ type: 'card.delete', id: 'c5' })
    expect(store.canRedo()).toBe(false)
    expect(store.getLog()).toHaveLength(1)
  })
})
