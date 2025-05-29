#!/usr/bin/env node

/**
 * Playwright MCP Server
 * Model Context Protocol server that provides Playwright automation capabilities
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

class PlaywrightMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'playwright-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.browser = null;
    this.context = null;
    this.page = null;

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'launch_browser',
            description: 'Launch a Playwright browser instance',
            inputSchema: {
              type: 'object',
              properties: {
                headless: {
                  type: 'boolean',
                  description: 'Whether to run browser in headless mode',
                  default: true,
                },
                viewport: {
                  type: 'object',
                  properties: {
                    width: { type: 'number', default: 1280 },
                    height: { type: 'number', default: 720 },
                  },
                },
                args: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Additional browser arguments',
                },
              },
            },
          },
          {
            name: 'navigate',
            description: 'Navigate to a URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The URL to navigate to',
                },
                waitUntil: {
                  type: 'string',
                  description: 'When to consider navigation complete',
                  enum: ['load', 'domcontentloaded', 'networkidle'],
                  default: 'domcontentloaded',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'click_element',
            description: 'Click on an element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector or text selector for the element',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'fill_input',
            description: 'Fill an input field with text',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the input element',
                },
                text: {
                  type: 'string',
                  description: 'Text to fill in the input',
                },
              },
              required: ['selector', 'text'],
            },
          },
          {
            name: 'get_text',
            description: 'Get text content from an element',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'screenshot',
            description: 'Take a screenshot of the page',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to save the screenshot',
                  default: 'test-results/screenshot.png',
                },
                fullPage: {
                  type: 'boolean',
                  description: 'Whether to capture full page',
                  default: false,
                },
              },
            },
          },
          {
            name: 'close_browser',
            description: 'Close the browser instance',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_page_info',
            description: 'Get current page information (title, URL, status)',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'set_cookie',
            description: 'Set a cookie for the current page',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Cookie name',
                },
                value: {
                  type: 'string',
                  description: 'Cookie value',
                },
                domain: {
                  type: 'string',
                  description: 'Cookie domain (optional)',
                },
                path: {
                  type: 'string',
                  description: 'Cookie path (optional)',
                  default: '/',
                },
              },
              required: ['name', 'value'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'launch_browser':
            return await this.launchBrowser(args);

          case 'navigate':
            return await this.navigate(args);

          case 'click_element':
            return await this.clickElement(args);

          case 'fill_input':
            return await this.fillInput(args);

          case 'get_text':
            return await this.getText(args);

          case 'screenshot':
            return await this.screenshot(args);

          case 'close_browser':
            return await this.closeBrowser();

          case 'get_page_info':
            return await this.getPageInfo();

          case 'set_cookie':
            return await this.setCookie(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }  async launchBrowser(args = {}) {
    const { headless = true, viewport = { width: 1280, height: 720 }, args: browserArgs = [] } = args;

    this.browser = await chromium.launch({
      headless,
      args: browserArgs,
      env: process.env.DISPLAY ? { DISPLAY: process.env.DISPLAY } : {},
    });

    this.context = await this.browser.newContext({
      viewport,
    });

    this.page = await this.context.newPage();

    return {
      content: [
        {
          type: 'text',
          text: `Browser launched successfully. Headless: ${headless}, Viewport: ${viewport.width}x${viewport.height}${browserArgs.length ? `, Args: ${browserArgs.join(' ')}` : ''}`,
        },
      ],
    };
  }

  async navigate(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Please launch browser first.');
    }

    const { url, waitUntil = 'domcontentloaded' } = args;
    await this.page.goto(url, { waitUntil });

    return {
      content: [
        {
          type: 'text',
          text: `Navigated to ${url}`,
        },
      ],
    };
  }

  async clickElement(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Please launch browser first.');
    }

    const { selector } = args;
    await this.page.locator(selector).click();

    return {
      content: [
        {
          type: 'text',
          text: `Clicked element: ${selector}`,
        },
      ],
    };
  }

  async fillInput(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Please launch browser first.');
    }

    const { selector, text } = args;
    await this.page.locator(selector).fill(text);

    return {
      content: [
        {
          type: 'text',
          text: `Filled input ${selector} with: ${text}`,
        },
      ],
    };
  }

  async getText(args) {
    if (!this.page) {
      throw new Error('Browser not launched. Please launch browser first.');
    }

    const { selector } = args;
    
    try {
      // 特別なケース: ページタイトルを取得する場合
      if (selector === 'title' || selector === 'head title' || selector.includes('head title')) {
        const title = await this.page.title();
        return {
          content: [
            {
              type: 'text',
              text: `Page title: ${title}`,
            },
          ],
        };
      }

      const element = this.page.locator(selector);
      
      // まず要素が存在するかチェック
      await element.waitFor({ timeout: 5000 });
      
      const text = await element.textContent({ timeout: 10000 });
      return {
        content: [
          {
            type: 'text',
            text: `Text from ${selector}: ${text}`,
          },
        ],
      };
    } catch (error) {
      // セレクターが見つからない場合、ページのタイトルやHTMLの一部を返す
      try {
        const pageTitle = await this.page.title();
        const url = this.page.url();
        return {
          content: [
            {
              type: 'text',
              text: `Selector "${selector}" not found. Page title: "${pageTitle}", URL: ${url}. Error: ${error.message}`,
            },
          ],
        };
      } catch (fallbackError) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting text from ${selector}: ${error.message}`,
            },
          ],
        };
      }
    }
  }

  async screenshot(args = {}) {
    if (!this.page) {
      throw new Error('Browser not launched. Please launch browser first.');
    }

    const { path: screenshotPath = 'test-results/screenshot.png', fullPage = false } = args;
    
    // Ensure directory exists
    const dir = path.dirname(screenshotPath);
    fs.mkdirSync(dir, { recursive: true });
    
    await this.page.screenshot({ path: screenshotPath, fullPage });

    return {
      content: [
        {
          type: 'text',
          text: `Screenshot saved to: ${screenshotPath}`,
        },
      ],
    };
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }

    return {
      content: [
        {
          type: 'text',
          text: 'Browser closed successfully',
        },
      ],
    };
  }

  async getPageInfo() {
    if (!this.page) {
      throw new Error('Browser not launched. Please launch browser first.');
    }

    try {
      const title = await this.page.title();
      const url = this.page.url();
      
      // ページの基本情報を取得
      const info = await this.page.evaluate(() => {
        return {
          readyState: document.readyState,
          hasBody: !!document.body,
          bodyHTML: document.body ? document.body.innerHTML.substring(0, 500) : 'No body',
          elementCount: document.querySelectorAll('*').length,
        };
      });

      return {
        content: [
          {
            type: 'text',
            text: `Page Info:
Title: ${title}
URL: ${url}
Ready State: ${info.readyState}
Has Body: ${info.hasBody}
Element Count: ${info.elementCount}
Body Preview: ${info.bodyHTML}...`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error getting page info: ${error.message}`,
          },
        ],
      };
    }
  }

  async setCookie(args) {
    if (!this.context) {
      throw new Error('Browser context not available. Please launch browser first.');
    }

    const { name, value, domain, path = '/' } = args;
    
    try {
      const cookie = {
        name,
        value,
        path,
      };

      if (domain) {
        cookie.domain = domain;
      }

      await this.context.addCookies([cookie]);

      return {
        content: [
          {
            type: 'text',
            text: `Cookie set: ${name}=${value}${domain ? ` for domain ${domain}` : ''}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error setting cookie: ${error.message}`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Playwright MCP Server running on stdio');
  }
}

const server = new PlaywrightMCPServer();
server.run().catch(console.error);
