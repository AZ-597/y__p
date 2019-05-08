const puppeteer = require('puppeteer');

const URL = "https://youla.ru/sankt-peterburg/nedvijimost/prodaja-kvartiri/kvartira-3-komnaty-107-m2-5cd19f83226e4846f701a421";

let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto(URL);

  let userName = await page.$eval('div[data-test-component="UserCell"] div p span', el => el.innerText);
  await page.click('button[data-test-action="PhoneNumberClick"]');

  page.waitForSelector('div[data-test-component="ProductPhoneNumberModal"] a[href^="tel:"]').then(() => {
    console.log('modal open');
  });

  //let telNum = await page.$eval('div[data-test-component="ProductPhoneNumberModal"] a[href^="tel:"]', el => el.innerText);


  console.log({
    userName,
    telNum
  });

  browser.close();
  return {
    userName,
    telNum
  };
};

scrape().then((value) => {
  console.log(value);
});
