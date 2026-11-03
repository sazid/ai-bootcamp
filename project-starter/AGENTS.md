# Kanban board

A frontend-only Kanban board. There is no backend. All data stays in the browser.

## Stack

- Vite, React, TypeScript (strict mode)
- Vitest for unit tests
- Playwright for browser tests

## Commands

- `npm run dev`: start the app
- `npm run check`: type check, lint and unit tests. Keep this under 30 seconds.
- `npm run test:e2e`: browser tests

Run `npm run check` after each change. Do not say a task is done until it passes.

## Rules

- Make the smallest change that solves the task.
- Follow `docs/design-system.md`. Use its tokens. Do not write raw color values.
- Every feature needs a test. For bug fixes, write the failing test first.
- Never skip, delete or weaken a test to make it pass. If a test looks wrong, stop and ask.
- Ask before you add a dependency. Check that the package is real and maintained.
- Use `data-testid` on elements that tests need.
- Never read `.env` files or print secrets.
- Never run `git push`, or any command that touches a server, unless I ask.

## Architecture

- Every change to the board goes through one command layer: `dispatch(command)`.
  Examples: `card.create`, `card.move`, `card.delete`.
- Buttons, keyboard shortcuts and tests all use the same commands.
- Each command is validated and written to an event log. Undo and redo use this log.
- In development, expose `window.__board` with `getState()` and `dispatch()`.
  Agents and tests use it to read and change state, without clicking pixels.

## UI work

- Show several options when the choice is visual.
- Check the page at 375px and 1280px wide.
- Everything must work with a keyboard, and text must meet WCAG AA contrast.
- Open the page and look at it. Passing tests do not prove that it looks right.
