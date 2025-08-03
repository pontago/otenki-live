import { test, expect } from '@playwright/test';

test.describe('ページ遷移', () => {
  test('ホームから東京都のページに遷移する', async ({ page }) => {
    await page.goto('/');

    const forecastHeading = page.locator('section[aria-label="forecast-heading"]');
    const kantoCard = forecastHeading.locator('div[data-slot="card"]').filter({ hasText: '関東地方' }).first();
    await expect(kantoCard).toBeVisible();

    await kantoCard.getByRole('link', { name: '関東地方' }).click();
    await expect(page).toHaveTitle(/関東地方の天気/);

    const tokyoCard = page.locator('div[data-slot="card"]').filter({ hasText: '東京都' }).first();
    await expect(tokyoCard).toBeVisible();

    await page.getByRole('link', { name: '東京都' }).click();
    await expect(page).toHaveTitle(/東京都の天気/);
  });

  test('このサイトについてのページに遷移する', async ({ page }) => {
    await page.goto('/');

    const aboutLink = page.locator('a').filter({ hasText: 'このサイトについて' }).first();
    await aboutLink.click();

    await expect(page).toHaveTitle(/このサイトについて/);
  });

  test('お問い合わせのページに遷移する', async ({ page }) => {
    await page.goto('/');

    const contactLink = page.locator('a').filter({ hasText: 'お問い合わせ' }).first();
    await contactLink.click();

    await expect(page).toHaveTitle(/お問い合わせ/);
  });

  test('クレジットのページに遷移する', async ({ page }) => {
    await page.goto('/');

    const creditsLink = page.locator('a').filter({ hasText: 'クレジット' }).first();
    await creditsLink.click();

    await expect(page).toHaveTitle(/クレジット/);
  });
});
