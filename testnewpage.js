const puppeteer = require('puppeteer');

let run = async () => {
  const browser = await puppeteer.launch({headless: false});
  const countOfPages = 15;
  for(let i = 0; i < countOfPages; i++){
    const page = await browser.newPage();
    setTimeout(function(){page.close()} , 3000);
  }
};

run();
