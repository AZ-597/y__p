const puppeteer = require('puppeteer');
const autoScroll = require('./autoscroll');

const URL = 'https://youla.ru/sankt-peterburg/nedvijimost/prodaja-kvartiri';

let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(URL);
  await page.setViewport({
    width: 1920,
    height: 800
  });

  await autoScroll(page);

  const allCards = await page.evaluate(() => {
    let cards = document.querySelectorAll('li.product_item');
    let links = [];
    for (let card of cards) {
      let link = card.querySelector('a').href;
      if (link.search(/youla.ru/i) != -1) {
        links.push(link);
      }
    }
    return links
  });


  let data = [];
  for (let item of allCards) {
    const page = await browser.newPage();
    await page.goto(item);

    await page.click('button[data-test-action="PhoneNumberClick"]');

    let userName = await page.$eval('div[data-test-component="UserCell"] div p span', el => el.innerText);

    let telNum = await page.$eval('div[data-test-component="ProductPhoneNumberModal"] a[href^="tel:"]', el => el.innerText);

    data.push({
      userName,
      telNum
    });
    console.log({
      userName,
      telNum
    });
    page.close();
  }

  browser.close();
  return data;
};

scrape().then((value) => {
  console.log(value);
  require('fs').writeFileSync('./tmp/data_youla.json', JSON.stringify(value, null, 2));
});
