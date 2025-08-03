import { test, expect } from '@playwright/test';

test.describe('ホームページ', () => {
  test('ホームページが開ける', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/お天気ライブ/);
  });

  test('マップに関東地方が表示される', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('img', { name: '日本地図' })).toBeVisible();
    await expect(page.getByTitle('関東地方')).toBeVisible();
  });

  test('関東地方のカードに気温、降水確率、推論情報が表示される', async ({ page }) => {
    await page.goto('/');

    // 関東地方のカードを取得
    const forecastHeading = page.locator('section[aria-label="forecast-heading"]');
    const kantoCard = forecastHeading.locator('div[data-slot="card"]').filter({ hasText: '関東地方' }).first();

    // カードが表示されていることを確認
    await expect(kantoCard).toBeVisible();

    // 気温情報が表示されていることを確認
    await expect(kantoCard.getByText(/最高/)).toBeVisible();
    await expect(kantoCard.getByText(/最低/)).toBeVisible();

    // 降水確率が表示されていることを確認
    await expect(kantoCard.getByText(/降水/)).toBeVisible();

    // 推論情報が表示されていることを確認
    await expect(kantoCard.getByText(/歩行者/)).toBeVisible();
    await expect(kantoCard.getByText(/傘利用/)).toBeVisible();
    await expect(kantoCard.getByText(/半袖/)).toBeVisible();
    await expect(kantoCard.getByText(/長袖/)).toBeVisible();
  });
});
