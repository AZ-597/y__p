const puppeteer = require('puppeteer');

const URL = 'http://books.toscrape.com/';

let scrape = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(URL);
  await page.waitFor(1000);
  //await page.click('#default > div > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img');

  /* const result = await page.evaluate(() => {
    let title = document.querySelector('#content_inner > article > div.row > div.col-sm-6.product_main > h1').innerText;
    let price = document.querySelector('#content_inner > article > div.row > div.col-sm-6.product_main > p.price_color').innerText;
    return {title, price}
  }); */
  const result = await page.evaluate(() => {
    let cards = document.querySelectorAll('article.product_pod');
    let data = [];
    for(let card of cards) {
      let title = card.querySelector('h3 > a').title;
      let price = card.querySelector('p.price_color').innerText;
      data.push({title, price});
    }
    return data
  });

  browser.close();
  return result;
};

scrape().then((value) => {
  console.log(value);
  require('fs').writeFileSync('./tmp/data.json', JSON.stringify(value, null, 2));
});
