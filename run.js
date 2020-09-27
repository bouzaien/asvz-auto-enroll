var moment = require('moment'); // used to retreive week number

require('dotenv').config();
require('log-timestamp')(function() { return '[' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '] -'});

const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const fs = require('fs');

var myArgs = process.argv.slice(2);
let rawdata = fs.readFileSync('events.json');
let event_config = JSON.parse(rawdata);

if (myArgs.length < 1) {
  console.log(myArgs.length + ' arguments given. Use "node run.js arg1 [arg2 [arg3 [...]]]"');
  process.exit();
} else {
  console.log('Arguments: ' + myArgs);
};

for (let i = 0; i < myArgs.length; i++) {
  let sch = event_config[myArgs[i]]["cron"]
  let eventID = moment().week() + event_config[myArgs[i]]["baseID"];
  let eventURL = 'https://schalter.asvz.ch/tn/lessons/' + eventID.toString();
  schedule.scheduleJob(sch, function(){
    enrollASVZ(eventID, eventURL);
  });
}

const enrollASVZ = async (eventID, eventURL) => {
  console.log('Enrollment for ' + eventID.toString() + ' has started.');
  console.log('Opening browser ...');
  let browser = await puppeteer.launch({
    //userDataDir: "./user_data",
    //headless: false
  });
  
  const page = await browser.newPage();

  console.log('Opening https://schalter.asvz.ch/tn/ ...');
  await page.goto('https://schalter.asvz.ch/tn/');
  
  await page.waitForSelector('button[name="provider"]');
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
  
  console.log('Logging in as ' + process.env.ETH_USR +  ' ...');
  await page.type('#username', process.env.ETH_USR);
  await page.type('#password', process.env.ETH_PASS);

  await Promise.all([
    page.waitForNavigation(),
    page.click('button[name="_eventId_proceed"]')
  ]);

  await page.waitForSelector('.table');
  console.log('Opening', eventURL, '...');
  await page.goto(eventURL);
  await page.waitForSelector('.enrollmentPlacePadding');
  await page.click('button[id="btnRegister"]');

  await browser.close();
  console.log('Enrollment for ' + eventID.toString() + ' has finished.');
};