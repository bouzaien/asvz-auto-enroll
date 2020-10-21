var moment = require('moment');

require('dotenv').config();
require('log-timestamp')(function() { return '[' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '] -'});

const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

var myArgs = process.argv.slice(2);

if (myArgs.length < 1) {
    console.log(myArgs.length + ' arguments given. Use "node library.js <refNumber>"');
    process.exit();
} else {
    console.log('Arguments: ' + myArgs);
};

rn = myArgs[0];
sch = myArgs[1]; // "0 0 8 * * 0"

const checkin = async (rn) => {
    let browser = await puppeteer.launch({
      //userDataDir: "./user_data",
      headless: false
    });
    
    const page = await browser.newPage();
  
    await page.goto('https://hbzwwws005.uzh.ch/booked-ubzh-extern/Web/index.php');
    
    await page.waitForSelector('button[name="login"]');
    await page.type('#email', process.env.ETH_USR);
    await page.type('#password', process.env.ETH_PASS);
  
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[name="login"]')
    ]);
  
    await page.waitForSelector('.reservations');

    eventID = 'https://hbzwwws005.uzh.ch/booked-ubzh-extern/Web/reservation.php?rn=' + rn
    console.log(eventID);
    await page.goto(eventID);
    
    await page.waitForSelector('.btnCheckin');
    await Promise.all([
        page.waitForNavigation(),
        page.click('button[class="btn btn-warning btnCheckin"]')
    ]);
    
    await browser.close();
  };

schedule.scheduleJob(sch, function(){
    checkin(rn);
});