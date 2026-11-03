# Live demo prompts

Paste these in order. Each one is one small step. Look at the result before you move on.

## 1. Set up the project

```text
Read AGENTS.md and docs/design-system.md. Then set up the project with Vite,
React and TypeScript. Add Vitest and Playwright. Add the scripts listed in
AGENTS.md. Before you add any dependency, tell me why we need it, and check
that the package name is real and well maintained. Stop when `npm run check`
passes and show me the result.
```

## 2. First visible screen

```text
Build a Kanban board with three columns: To do, Doing, Done. Add sample cards.
Follow the design system. Start the dev server and show me the page.
```

## 3. Ask for options, then choose

```text
Use the ui-variations skill. Show me three different visual designs for a card
on a /variations page. Check color contrast for each one. Do not change the
board yet.
```

## 4. Add a feature with a test first

```text
Add drag and drop between columns. It must also work with the keyboard.
Write a Playwright test first, then make it pass.
```

## 5. Pick apart one piece of UI

```text
Look at the card on a 375px wide screen and take a screenshot. List what looks
wrong. Fix only the top two problems. Show me before and after.
```

## 6. Design first, then keep the state safe

Send this part first, and discuss the answer:

```text
Do not write code yet. We need to save the board and add undo and redo.
Ask me any questions first. Then propose two or three designs for storage,
the data schema, the command shapes and future sync with a server. Give the
pros and cons of each. Tell me what would be hard to change later.
```

After you choose a design, send this part:

```text
Write our decision in docs/design.md. Then build it. Use the command layer
from AGENTS.md. Add tests for save, load, undo and redo.
```

## 7. Review with fresh eyes

```text
Start a new session with no chat history. Review the diff against main.
Find bugs, weak tests, and places where a test was changed only to make it pass.
Do not fix anything yet.
```

## 8. Test that the agent does not cheat

```text
Run `npm run check` yourself and paste the real output. List every test you
skipped, deleted or weakened in this session. If there are none, say so.
```
