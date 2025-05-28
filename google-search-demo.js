const { chromium, firefox } = require('playwright');

async function runGoogleSearchDemo() {
  console.log('🚀 Starting Google search demo...');
  
  // VNC環境用の設定
  const launchOptions = {
    headless: false,
    slowMo: 2000, // 操作をゆっくり表示
    env: {
      DISPLAY: ':1'
    }
  };

  console.log('🌐 Launching Firefox browser...');
  const browser = await firefox.launch(launchOptions);
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 }
  });
  const page = await context.newPage();

  try {
    console.log('📄 Navigating to Google...');
    await page.goto('https://www.google.com');
    
    // Googleのプライバシー設定がある場合の対応
    try {
      await page.click('button:has-text("すべて同意")', { timeout: 3000 });
    } catch (e) {
      try {
        await page.click('button:has-text("Accept all")', { timeout: 3000 });
      } catch (e) {
        console.log('No privacy dialog found, continuing...');
      }
    }

    console.log('🔍 Searching for "google"...');
    
    // 検索ボックスを見つけて "google" を入力
    const searchBox = page.locator('textarea[name="q"]');
    await searchBox.fill('google');
    
    // Enterキーを押すか検索ボタンをクリック
    await searchBox.press('Enter');
    
    console.log('⏳ Waiting for search results...');
    await page.waitForSelector('div#search', { timeout: 10000 });
    
    console.log('✅ Search completed! Results are displayed.');
    
    // 検索結果を少し待機して表示
    await page.waitForTimeout(5000);
    
    // スクリーンショットを撮影（オプション）
    await page.screenshot({ path: 'results/google-search.png', fullPage: true });
    console.log('📸 Screenshot saved as results/google-search.png');
    
  } catch (error) {
    console.error('❌ Error during demo:', error);
  } finally {
    console.log('🔚 Demo completed. Browser will remain open for 10 more seconds...');
    await page.waitForTimeout(10000);
    
    console.log('🚪 Closing browser...');
    await browser.close();
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  runGoogleSearchDemo().catch(console.error);
}

module.exports = { runGoogleSearchDemo };
