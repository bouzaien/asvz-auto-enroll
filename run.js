require('dotenv').config();
var moment = require('moment'); // used to retreive week number
require('log-timestamp')(function() { return '[' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '] -'});

const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

var myArgs = process.argv.slice(2); // node run.js <param>

if (myArgs[0]=='mon'){
  var sch = '55 59 17 * * 0'; // scheduled for monday at 18:00:15
  var eventID = moment().week() + 134224; // 39 => 134263
} else if (myArgs[0]=='wed'){
  var sch = '55 59 19 * * 2'; // scheduled for thursday at 19:15:15
  var eventID = moment().week() + 134437; // 40 => 134477
} else if (myArgs[0]=='thu'){
  var sch = '55 14 19 * * 3'; // scheduled for thursday at 19:15:15
  var eventID = moment().week() + 134621; // 39 => 134660
} else {
  var sch = myArgs[1];
  var eventID = myArgs[0];
};

var eventURL = 'https://schalter.asvz.ch/tn/lessons/' + eventID.toString();

const enrollASVZ = async (eventURL) => {
  console.log('Enrollment for ' + eventID.toString() + ' has started.');
  console.log('Opening browser ...');
  let browser = await puppeteer.launch({
    //userDataDir: "./user_data",
    headless: false
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
  await page.goto(eventURL); // TODO: dynamic lesson id
  await page.waitForSelector('.enrollmentPlacePadding');
  await page.click('button[id="btnRegister"]');

  await browser.close();
  console.log('Enrollment for ' + eventID.toString() + ' has finished.');
};

schedule.scheduleJob(sch, function(){
  enrollASVZ(eventURL);
});

//console.log(moment().week() + 134224);