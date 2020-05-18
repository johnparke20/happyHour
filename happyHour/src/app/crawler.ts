import {URL} from 'url';
import {mkdirSync, existsSync} from 'fs';
import * as puppeteer from 'puppeteer';

export class Crawler {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  crawl(site: any) {
    (async () => {
      // Wait for browser launching.
     const browser = await puppeteer.launch();
     // Wait for creating the new page.
     const page = await browser.newPage();

     await this.crawlInternal(page, `${this.baseUrl}/index.html`, site["children"], site["name"]);

     browser.close();
    })();
  }

  /**
   * Crawling the site recursively
   * selectors is a list of selectors of child pages.
   */
  async crawlInternal(page: any, path: string, selectors: string[], dirname: string) {
    // Create a directory storing the result PDFs.
    if (!existsSync(dirname)) {
      mkdirSync(dirname);
    }

    // Go to the target page.
    let url = new URL(path);
    await page.goto(path, {waitUntil: 'networkidle'});
    // Take a snapshot in PDF format.
    await page.pdf({path:
      `${dirname}/${url.pathname.slice(1).replace("/", "-")}.pdf`, format: 'A4'});
    if (selectors.length == 0) {
      return;
    }

       // Traversing in an order of BFS.
    let items: string[] = await page.evaluate((sel) => {
      let ret = [];
       document.querySelectorAll(sel).forEach(item=> {
        let href = item.getAttribute("href");
        ret.push(href);
       });
       return ret;
    }, selectors[0]["selector"]);

    for (let item of items) {
      console.log(`Capturing ${item}`);
      await this.crawlInternal(page,
        `${item}`, selectors[0]["children"], `${dirname}/${selectors[0]["name"]}`)
    }
  }
}