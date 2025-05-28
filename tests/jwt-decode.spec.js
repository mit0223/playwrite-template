const { test, expect } = require('@playwright/test');
const inputJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtaXQwMjIzIiwibmFtZSI6Ik1pdHN1cnUiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzQ4NTI0NzI0fQ.UqAKDsDYaUViUqKRwfaGRUDBWNxUdy1amAS-3xLh8k0'

test('JWT decode test', async ({ page }) => {
  // ab-variantクッキーにvariantを設定
  await page.context().addCookies([
    {
      name: 'ab-variant',
      value: 'variant',
      domain: 'jwt.io',
      path: '/',
      httpOnly: false,
      secure: true,
      sameSite: 'Lax'
    }
  ]);
  
  // jwt.ioに移動
  await page.goto('https://jwt.io/');

  const clearButton = page.locator('div.card_card__headline__AWfE_:has(h4:has-text("JSON Web Token (JWT)")) div[aria-label="JWT editor toolbar"] button:has-text("Clear")');
  // JWTエディターのクリアボタンをクリック
  await clearButton.click();
  // JWTエディターにサンプルJWTを入力
  const jwtTextarea = page.locator('textarea[role="textbox"]');
  await jwtTextarea.fill(inputJWT);
  // JWT デコード結果が表示されるまで待機
  await page.waitForTimeout(3000);
    
  // デコードされたJSONの内容を確認
  const jsonViewer = page.locator('div[aria-labelledby="react-aria-:R5ld577majsq:-tab-decoder__payload__json"]');
    
  await expect(jsonViewer).toBeVisible();
  // JSONビューアー全体のテキストを取得
  const jsonContent = await jsonViewer.textContent();
  console.log('📄 Decoded JSON content:', jsonContent);
  
  // 期待する値が含まれているかチェック
  const expectedValues = ['"sub": "mit0223"', '"name": "Mitsuru"', '"admin": true', '"iat": 1748524724'];
  for (const expectedValue of expectedValues) {
    expect(jsonContent.includes(expectedValue), `Expected value not found: ${expectedValue}`).toBeTruthy();
  }
});
