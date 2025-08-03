import { test, expect } from '@playwright/test';

test.describe('地域ページ', () => {
  test('関東地方のページが開ける', async ({ page }) => {
    await page.goto('/kanto');

    await expect(page).toHaveTitle(/関東地方の天気/);
  });

  test('東京都のカードに気温、降水確率、推論情報が表示される', async ({ page }) => {
    await page.goto('/kanto');

    // 東京都のカードを取得
    const tokyoCard = page.locator('div[data-slot="card"]').filter({ hasText: '東京都' }).first();

    // カードが表示されていることを確認
    await expect(tokyoCard).toBeVisible();

    // リンクが正しいことを確認
    const links = tokyoCard.locator('a');
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; i++) {
      await expect(links.nth(i)).toHaveAttribute('href', '/kanto/tokyo');
    }

    // 気温情報が表示されていることを確認
    await expect(tokyoCard.getByText(/最高/)).toBeVisible();
    await expect(tokyoCard.getByText(/最低/)).toBeVisible();

    // 降水確率が表示されていることを確認
    await expect(tokyoCard.getByText(/降水/)).toBeVisible();

    // 推論情報が表示されていることを確認
    await expect(tokyoCard.getByText(/歩行者/)).toBeVisible();
    await expect(tokyoCard.getByText(/傘利用/)).toBeVisible();
    await expect(tokyoCard.getByText(/半袖/)).toBeVisible();
    await expect(tokyoCard.getByText(/長袖/)).toBeVisible();
  });
});
