import { test, expect } from '@playwright/test';

const savedKey = 'travel-planner-personal-demo-v1';
const historyKey = 'travel-planner-recent-v1';

test.beforeEach(async ({ context, page, baseURL }) => {
  const origin = new URL(baseURL).origin;
  await context.route('**/*', route => {
    const request = route.request();
    return new URL(request.url()).origin === origin && ['GET', 'HEAD'].includes(request.method())
      ? route.continue()
      : route.abort();
  });
  await page.goto('/demo/');
  await page.getByRole('button', { name: 'Build itinerary →', exact: true }).click();
  await page.getByRole('button', { name: 'Save locally', exact: true }).click();
});

test('reduced motion keeps the navigation usable without sliding transitions', async ({ page }) => {
  await page.emulateMedia({reducedMotion: 'reduce'});
  const saved = await page.evaluate(key => localStorage.getItem(key), savedKey);
  const open = page.getByRole('button', {name: 'Open navigation menu', exact: true});
  await open.click();
  const menu = page.getByRole('navigation', {name: 'Trip planner', exact: true});
  await expect(menu).toBeVisible();
  await expect(page.locator('#travel-planner-drawer')).toHaveCSS('transition-duration', '0s');
  await expect(page.locator('#travel-planner-drawer')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({reducedMotion: 'no-preference'});
  await expect(page.locator('#travel-planner-drawer')).not.toHaveCSS('transition-duration', '0s');
  await page.emulateMedia({reducedMotion: 'reduce'});
  await expect(page.locator('#travel-planner-drawer')).toHaveCSS('transition-duration', '0s');
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();
  await expect(open).toBeFocused();
  expect(await page.evaluate(key => localStorage.getItem(key), savedKey)).toBe(saved);
});

test('keyboard focus follows a reordered stop without changing the saved copy', async ({ page }) => {
  const saved = await page.evaluate(key => localStorage.getItem(key), savedKey);
  const stops = page.locator('main li h4');
  const names = await stops.allTextContents();
  expect(names).toHaveLength(4);
  const name = names[0];
  const later = page.getByRole('button', { name: `Move ${name} later`, exact: true });
  await later.click();
  await expect(stops.nth(1)).toHaveText(name);
  await expect(later).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(stops.nth(2)).toHaveText(name);
  await expect(later).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(stops.nth(3)).toHaveText(name);
  await expect(stops.nth(3)).toBeFocused();

  const earlier = page.getByRole('button', { name: `Move ${name} earlier`, exact: true });
  await earlier.click();
  await expect(earlier).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(earlier).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(stops).toHaveText(names);
  await expect(stops.first()).toBeFocused();
  await expect(page.getByRole('status')).toContainText('stop 1 of 4');
  expect(await page.evaluate(key => localStorage.getItem(key), savedKey)).toBe(saved);
});

test('failed history removal preserves recent plans and supports retry', async ({ page }) => {
  const saved = await page.evaluate(key => localStorage.getItem(key), savedKey);
  await page.evaluate(key => {
    const remove = Storage.prototype.removeItem;
    window.failHistoryClear = true;
    Storage.prototype.removeItem = function (item) {
      if (item === key && window.failHistoryClear) throw new DOMException('Synthetic storage failure', 'SecurityError');
      return remove.call(this, item);
    };
  }, historyKey);
  await page.getByRole('button', { name: 'Open navigation menu', exact: true }).click();
  const menu = page.getByRole('navigation', { name: 'Trip planner', exact: true });
  const recent = menu.locator('a[href*="history="]');
  await expect(recent).toHaveCount(1);
  await menu.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(menu.getByRole('status')).toContainText('could not be cleared');
  await expect(recent).toHaveCount(1);
  await page.evaluate(() => { window.failHistoryClear = false; });
  await menu.getByRole('button', { name: 'Clear', exact: true }).click();
  await expect(menu.getByRole('status')).toContainText('Recent itineraries cleared');
  await expect(recent).toHaveCount(0);
  expect(await page.evaluate(key => localStorage.getItem(key), historyKey)).toBeNull();
  expect(await page.evaluate(key => localStorage.getItem(key), savedKey)).toBe(saved);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('saving or removing a copy in another tab updates controls without changing the current plan', async ({ context, page }) => {
  await page.getByRole('button', { name: 'Remove saved copy', exact: true }).click();
  const other = await context.newPage();
  try {
    await other.goto('/demo/');
    const load = other.getByRole('button', { name: 'Load saved plan', exact: true });
    const destination = other.getByLabel('Destination');
    const days = other.getByLabel('How many days?');
    const draftInterest = other.getByRole('checkbox', { name: 'Culture', exact: true });
    await expect(load).toHaveCount(0);
    await destination.selectOption('Edinburgh');
    await days.fill('3');
    await draftInterest.check();
    await other.getByRole('button', { name: 'Build itinerary →', exact: true }).click();
    await expect(other.locator('main li h4')).toHaveCount(6);
    const originalStops = await other.locator('main li h4').allTextContents();

    await page.getByLabel('Destination').selectOption('York');
    await page.getByRole('checkbox', { name: 'Outdoors', exact: true }).check();
    await page.getByRole('button', { name: 'Build itinerary →', exact: true }).click();
    await page.getByRole('button', { name: 'Save locally', exact: true }).click();
    await expect(load).toBeVisible();
    await expect(destination).toHaveValue('Edinburgh');
    await expect(days).toHaveValue('3');
    await expect(draftInterest).toBeChecked();
    await expect(other.locator('main li h4')).toHaveText(originalStops);

    await load.click();
    await expect(destination).toHaveValue('York');
    await expect(days).toHaveValue('2');
    await expect(other.getByRole('checkbox', { name: 'Outdoors', exact: true })).toBeChecked();
    await expect(other.locator('main li h4')).toHaveCount(4);
    const loadedStops = await other.locator('main li h4').allTextContents();
    await page.getByRole('button', { name: 'Remove saved copy', exact: true }).click();
    await expect(load).toHaveCount(0);
    await expect(other.locator('main li h4')).toHaveText(loadedStops);
  } finally {
    await other.close();
  }
});
