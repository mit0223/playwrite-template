const { test, expect } = require('@playwright/test');

test('Google search test', async ({ page }) => {
  // Google.comに移動
  await page.goto('https://www.google.com');
  
  // プライバシー設定の処理
  try {
    await page.click('button:has-text("すべて同意")', { timeout: 3000 });
  } catch (e) {
    try {
      await page.click('button:has-text("Accept all")', { timeout: 3000 });
    } catch (e) {
      // プライバシーダイアログがない場合は続行
    }
  }

  // 検索ボックスに "google" を入力
  const searchBox = page.locator('input[name="q"]');
  await searchBox.fill('google');
  
  // 検索実行
  await searchBox.press('Enter');
  
  // 検索結果の表示を待機
  await page.waitForSelector('div#search');
  
  // 検索結果が表示されていることを確認
  await expect(page.locator('div#search')).toBeVisible();
  
  // タイトルに "google" が含まれていることを確認
  await expect(page).toHaveTitle(/google/i);
});
