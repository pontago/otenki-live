import { test, expect } from '@playwright/test';

test.describe('都道府県ページ', () => {
  test('東京都のページが開ける', async ({ page }) => {
    await page.goto('/kanto/tokyo');

    await expect(page).toHaveTitle(/東京都の天気/);
  });

  test('東京都のカードに気温、降水確率、推論情報が表示される', async ({ page }) => {
    await page.goto('/kanto/tokyo');

    const tokyoCard = page.locator('div[data-slot="card"]').filter({ hasText: '東京都' }).first();

    await expect(tokyoCard).toBeVisible();

    await expect(tokyoCard.getByText(/最高/)).toBeVisible();
    await expect(tokyoCard.getByText(/最低/)).toBeVisible();

    await expect(tokyoCard.getByText(/歩行者/)).toBeVisible();
    await expect(tokyoCard.getByText(/傘利用/)).toBeVisible();
    await expect(tokyoCard.getByText(/半袖/)).toBeVisible();
    await expect(tokyoCard.getByText(/長袖/)).toBeVisible();
  });

  test('ライブストリームのカードに推論情報が表示される', async ({ page }) => {
    await page.goto('/kanto/tokyo');

    const liveStreamCard = page.locator('div[data-slot="card"]').filter({ hasText: 'ライブストリーム' }).first();
    await expect(liveStreamCard).toBeVisible();

    const cardContent = liveStreamCard.locator('div[data-slot="card"]').filter({ hasText: '00:00' }).first();
    await expect(cardContent).toBeVisible();

    await expect(cardContent.getByText(/歩行者/)).toBeVisible();
    await expect(cardContent.getByText(/傘利用/)).toBeVisible();
    await expect(cardContent.getByText(/半袖/)).toBeVisible();
    await expect(cardContent.getByText(/長袖/)).toBeVisible();
  });

  test('3時間ごとの天気カードに気温が表示される', async ({ page }) => {
    await page.goto('/kanto/tokyo');

    const weatherCard = page.locator('div[data-slot="card"]').filter({ hasText: '3時間ごとの天気' }).first();
    await expect(weatherCard).toBeVisible();

    const cardContent = weatherCard.locator('div[data-slot="card"]').filter({ hasText: '00:00' }).first();
    await expect(cardContent).toBeVisible();

    await expect(cardContent.getByText(/20°C/)).toBeVisible();
  });

  test('今後の天気カードに気温が表示される', async ({ page }) => {
    await page.goto('/kanto/tokyo');

    const weatherCard = page.locator('div[data-slot="card"]').filter({ hasText: '今後の天気' }).first();
    await expect(weatherCard).toBeVisible();

    const cardContent = weatherCard.locator('div[data-slot="card"]').filter({ hasText: '6/23' }).first();
    await expect(cardContent).toBeVisible();

    await expect(cardContent.getByText(/30°C/)).toBeVisible();
    await expect(cardContent.getByText(/20°C/)).toBeVisible();
    await expect(cardContent.getByText(/40%/)).toBeVisible();
  });
});
