import { expect, test } from '@playwright/test'

test('shows the board heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Kanban board' })).toBeVisible()
})

test('shows three columns with sample cards', async ({ page }) => {
  await page.goto('/')
  for (const name of ['To do', 'Doing', 'Done']) {
    await expect(page.getByRole('region', { name })).toBeVisible()
  }
  await expect(page.getByTestId('column-todo').getByTestId('card-c1')).toBeVisible()
})

test('moves a card with the keyboard and undoes it', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Move "Write project brief" to Doing' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('column-doing').getByTestId('card-c1')).toBeVisible()
  await page.getByTestId('undo').click()
  await expect(page.getByTestId('column-todo').getByTestId('card-c1')).toBeVisible()
})

test('move buttons name the target column', async ({ page }) => {
  await page.goto('/')
  const card = page.getByTestId('card-c3')
  await expect(card.getByRole('button', { name: 'Move "Set up design tokens" to To do' })).toHaveText('← To do')
  await expect(card.getByRole('button', { name: 'Move "Set up design tokens" to Done' })).toHaveText('Done →')
})

test('drags a card to another column with the mouse', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('card-c1').dragTo(page.getByTestId('column-done'))
  await expect(page.getByTestId('column-done').getByTestId('card-c1')).toBeVisible()
  expect(await page.evaluate(() => window.__board!.getLog().map((e) => e.command))).toEqual([{ type: 'card.move', id: 'c1', column: 'done' }])
})

test('drags a card with the keyboard and keeps focus on it', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('card-c1').focus()
  await page.keyboard.press('Space')
  await expect(page.getByTestId('drag-status')).toHaveText(/Picked up "Write project brief"/)
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('drag-status')).toHaveText(/Done/)
  await page.keyboard.press('Space')
  await expect(page.getByTestId('column-done').getByTestId('card-c1')).toBeFocused()
  await expect(page.getByTestId('drag-status')).toHaveText(/Moved "Write project brief" to Done/)
})

test('Escape cancels a keyboard drag', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('card-c1').focus()
  await page.keyboard.press('Space')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('column-todo').getByTestId('card-c1')).toBeFocused()
  await expect(page.getByTestId('drag-status')).toHaveText(/Cancelled/)
  expect(await page.evaluate(() => window.__board!.getLog())).toEqual([])
})

test('variations page shows three board designs', async ({ page }) => {
  await page.goto('/variations')
  for (const id of ['1', '2', '3']) {
    await expect(page.getByTestId(`variation-${id}`).getByRole('listitem')).toHaveCount(2)
  }
})

test('window.__board dispatch updates the page', async ({ page }) => {
  await page.goto('/')
  const result = await page.evaluate(() => window.__board!.dispatch({ type: 'card.move', id: 'c3', column: 'done' }, 'agent'))
  expect(result).toEqual({ ok: true })
  await expect(page.getByTestId('column-done').getByTestId('card-c3')).toBeVisible()
  expect(await page.evaluate(() => window.__board!.getLog()[0].actor)).toBe('agent')
})
