export const COLUMNS = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
] as const

export type ColumnId = (typeof COLUMNS)[number]['id']

export interface Card {
  id: string
  title: string
  column: ColumnId
}

export interface BoardState {
  cards: Card[]
}

export type Command =
  | { type: 'card.create'; title: string; column: ColumnId; id?: string }
  | { type: 'card.move'; id: string; column: ColumnId }
  | { type: 'card.delete'; id: string }
  | { type: 'board.undo' }
  | { type: 'board.redo' }

export type Actor = 'user' | 'agent' | 'test'

// A logged event is a command that passed validation, with any generated values filled in.
export interface BoardEvent {
  seq: number
  at: string
  actor: Actor
  command: Exclude<Command, { type: 'board.undo' | 'board.redo' }>
}

export type DispatchResult = { ok: true } | { ok: false; error: string }

export const SAMPLE_STATE: BoardState = {
  cards: [
    { id: 'c1', title: 'Write project brief', column: 'todo' },
    { id: 'c2', title: 'Sketch board layout', column: 'todo' },
    { id: 'c3', title: 'Set up design tokens', column: 'doing' },
    { id: 'c4', title: 'Build command layer', column: 'doing' },
    { id: 'c5', title: 'Create Vite project', column: 'done' },
  ],
}

const columnIds = new Set<string>(COLUMNS.map((c) => c.id))

export function columnTitle(id: ColumnId): string {
  return COLUMNS.find((c) => c.id === id)!.title
}

function validate(state: BoardState, command: BoardEvent['command']): string | null {
  switch (command.type) {
    case 'card.create':
      if (!command.title.trim()) return 'Title is required'
      if (!columnIds.has(command.column)) return `Unknown column: ${command.column}`
      if (command.id && state.cards.some((c) => c.id === command.id)) return `Card already exists: ${command.id}`
      return null
    case 'card.move': {
      const card = state.cards.find((c) => c.id === command.id)
      if (!card) return `Unknown card: ${command.id}`
      if (!columnIds.has(command.column)) return `Unknown column: ${command.column}`
      if (card.column === command.column) return `Card is already in ${command.column}`
      return null
    }
    case 'card.delete':
      return state.cards.some((c) => c.id === command.id) ? null : `Unknown card: ${command.id}`
  }
}

function apply(state: BoardState, command: BoardEvent['command']): BoardState {
  switch (command.type) {
    case 'card.create':
      return { cards: [...state.cards, { id: command.id!, title: command.title.trim(), column: command.column }] }
    case 'card.move': {
      const card = state.cards.find((c) => c.id === command.id)!
      // Moved cards go to the bottom of the target column.
      return { cards: [...state.cards.filter((c) => c !== card), { ...card, column: command.column }] }
    }
    case 'card.delete':
      return { cards: state.cards.filter((c) => c.id !== command.id) }
  }
}

export function createBoardStore(initial: BoardState = SAMPLE_STATE) {
  let log: BoardEvent[] = []
  // Events before the cursor are applied; events after it can be redone.
  let cursor = 0
  let state = initial
  let nextId = 1
  const listeners = new Set<() => void>()

  const rebuild = () => {
    state = log.slice(0, cursor).reduce((s, e) => apply(s, e.command), initial)
    listeners.forEach((l) => l())
  }

  return {
    getState: () => state,
    getLog: () => log.slice(0, cursor),
    canUndo: () => cursor > 0,
    canRedo: () => cursor < log.length,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    dispatch(command: Command, actor: Actor = 'user'): DispatchResult {
      if (command.type === 'board.undo' || command.type === 'board.redo') {
        const undo = command.type === 'board.undo'
        if (undo ? cursor === 0 : cursor === log.length) return { ok: false, error: `Nothing to ${undo ? 'undo' : 'redo'}` }
        cursor += undo ? -1 : 1
        rebuild()
        return { ok: true }
      }
      const error = validate(state, command)
      if (error) return { ok: false, error }
      let filled = command
      if (command.type === 'card.create' && !command.id) {
        while (state.cards.some((c) => c.id === `card-${nextId}`)) nextId++
        filled = { ...command, id: `card-${nextId++}` }
      }
      log = [...log.slice(0, cursor), { seq: cursor + 1, at: new Date().toISOString(), actor, command: filled }]
      cursor = log.length
      rebuild()
      return { ok: true }
    },
  }
}

export type BoardStore = ReturnType<typeof createBoardStore>

export const board = createBoardStore()
