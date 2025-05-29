import { chromium } from 'playwright-extra';
const inputJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtaXQwMjIzIiwibmFtZSI6Ik1pdHN1cnUiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzQ4NTI0NzI0fQ.UqAKDsDYaUViUqKRwfaGRUDBWNxUdy1amAS-3xLh8k0';
export async function runJwtIoSearchDemo() {
    console.log('🚀 Starting JWT.IO search demo...');
    // VNC環境用の設定
    const launchOptions = {
        headless: false,
        slowMo: 2000, // 操作をゆっくり表示
        env: {
            DISPLAY: ':1',
        },
    };
    console.log('🌐 Launching Chromium browser (with stealth)...');
    const browser = await chromium.launch(launchOptions);
    const context = await browser.newContext({
        viewport: { width: 1024, height: 768 },
    });
    // ab-variantクッキーにvariantを設定
    await context.addCookies([
        {
            name: 'ab-variant',
            value: 'variant',
            domain: 'jwt.io',
            path: '/',
            httpOnly: false,
            secure: true,
            sameSite: 'Lax',
        },
    ]);
    const page = await context.newPage();
    try {
        console.log('📄 Navigating to JWT.IO...');
        // v2を指定したURLパラメータでアクセス
        await page.goto('https://jwt.io/', { waitUntil: 'domcontentloaded' });
        console.log('🔍 Inputting JWT token into Decoder');
        // JWTセクションのClearボタンをクリック（もし存在する場合）
        // JWTセクション（"JSON Web Token (JWT)"の見出しを持つ）のClearボタンを特定
        const clearButton = page.locator('div.card_card__headline__AWfE_:has(h4:has-text("JSON Web Token (JWT)")) div[aria-label="JWT editor toolbar"] button:has-text("Clear")');
        if (await clearButton.isVisible()) {
            await clearButton.click();
            console.log('🧹 Cleared previous content');
        }
        // JWTデコーダーのテキストエリアを見つけて JWT を入力
        const jwtTextarea = page.locator('textarea[role="textbox"]');
        await jwtTextarea.fill(inputJWT);
        console.log('⏳ Waiting for JWT to be decoded...');
        // JWT デコード結果が表示されるまで待機
        await page.waitForTimeout(3000);
        // デコードされたJSONの内容を確認
        console.log('🔍 Verifying decoded JSON content...');
        const jsonViewer = page.locator('div[aria-labelledby="react-aria-:R5ld577majsq:-tab-decoder__payload__json"]');
        if (await jsonViewer.isVisible()) {
            // JSONビューアー全体のテキストを取得
            const jsonContent = await jsonViewer.textContent();
            console.log('📄 Decoded JSON content:', jsonContent);
            // 期待する値が含まれているかチェック
            const expectedValues = ['"sub": "mit0223"', '"name": "Mitsuru"', '"admin": true', '"iat": 1748524724'];
            let allValuesFound = true;
            for (const expectedValue of expectedValues) {
                if (jsonContent?.includes(expectedValue)) {
                    console.log(`✅ Found: ${expectedValue}`);
                }
                else {
                    console.log(`❌ Missing: ${expectedValue}`);
                    allValuesFound = false;
                }
            }
            if (allValuesFound) {
                console.log('🎉 All expected JWT payload values verified successfully!');
            }
            else {
                console.log('⚠️ Some expected values were not found in the decoded JWT');
            }
        }
        else {
            console.log('❌ JSON viewer not found - JWT may not have been decoded properly');
        }
        // 追加の待機時間
        await page.waitForTimeout(2000);
        // スクリーンショットを撮影（オプション）
        await page.screenshot({ path: 'test-results/jwt-decode.png', fullPage: true });
        console.log('📸 Screenshot saved as test-results/jwt-decode.png');
    }
    catch (error) {
        console.error('❌ Error during demo:', error);
    }
    finally {
        console.log('🔚 Demo completed. Browser will remain open for 10 more seconds...');
        await page.waitForTimeout(10000);
        console.log('🚪 Closing browser...');
        await browser.close();
    }
}
// スクリプトが直接実行された場合
if (import.meta.url === `file://${process.argv[1]}`) {
    runJwtIoSearchDemo().catch(console.error);
}
//# sourceMappingURL=jwt-decode-demo.js.map