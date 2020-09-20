require('dotenv').config();

const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

const enrollASVZ = async () => {
  let browser = await puppeteer.launch({
    //userDataDir: "./user_data",
    headless: false
  });
  
  const page = await browser.newPage();

  await page.goto('https://schalter.asvz.ch/tn/');
  
  await page.waitFor(2000);
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[name="provider"]')
  ]);

  await page.select('select[id="userIdPSelection"]', "https://aai-logon.ethz.ch/idp/shibboleth");
  
  await Promise.all([
    page.waitForNavigation(),
    page.click('input[name="Select"]')
  ]);
  
  await page.waitForSelector('.form-element .form-field');
  
  await page.type('#username', process.env.ETH_USR);
  await page.type('#password', process.env.ETH_PASS);

  await Promise.all([
    page.waitForNavigation(),
    page.click('button[name="_eventId_proceed"]')
  ]);

  await page.waitFor(10000);
  await page.goto('https://schalter.asvz.ch/tn/lessons/134263'); // TODO: dynamic lesson id
  await page.waitForSelector('.enrollmentPlacePadding');
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[id="btnRegister"]')
  ]);

  await page.screenshot({path: 'final.png'});

  await browser.close();
};

schedule.scheduleJob('15 00 18 * * 0', function(){
  console.log('Enrollment started.');
  enrollASVZ();
});