import puppeteer from 'puppeteer';
import 'dotenv/config';
import fs from 'node:fs';

const {
  APT_NAME,
  FIRST_NAME,
  LAST_NAME,
  UNIT_NO,
  CAR_MAKE,
  CAR_MODEL,
  CAR_COLOR,
  CAR_PLATE,
  GUEST_EMAIL,
} = process.env;

const delay = 100;

function getEmailDirectory(email: string) {
  return email.replaceAll('.', '_');
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://app.parkingbadge.com/#/guest');

  // Set screen size
  await page.setViewport({ width: 1080, height: 1440 });

  await page.waitForSelector('label::-p-text(Register New Parking)');

  // Type into search box
  await page.type('label::-p-text(Apartment Community) ~ input', APT_NAME, {
    delay,
  });

  page.keyboard.press('ArrowDown', { delay });
  page.keyboard.press('Enter', { delay });
  page.keyboard.press('Tab', { delay });

  // Type into search box
  await page.type('label::-p-text(Resident first name) ~ input', FIRST_NAME, {
    delay,
  });

  // Type into search box
  await page.type('label::-p-text(Resident last name) ~ input', LAST_NAME, {
    delay,
  });

  // Type into search box
  await page.type('label::-p-text(Resident unit #) ~ input', UNIT_NO, {
    delay,
  });

  // Type into search box
  await page.type('label::-p-text(Vehicle make) ~ input', CAR_MAKE, {
    delay,
  });

  // Type into search box
  await page.type('label::-p-text(Vehicle model) ~ input', CAR_MODEL, {
    delay,
  });

  // Type into search box
  await page.type('label::-p-text(Vehicle color) ~ input', CAR_COLOR, {
    delay,
  });

  // Type into search box
  await page.type('label::-p-text(License Plate) ~ input', CAR_PLATE, {
    delay,
  });

  // Type into search box
  await page.type('label::-p-text(Your Email) ~ input', GUEST_EMAIL, {
    delay,
  });

  const directory = `./screenshots/${getEmailDirectory(GUEST_EMAIL)}`;

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  page.screenshot({
    path: `${directory}/form.png`,
    fullPage: true,
  });

  await page.click('button::-p-text(Next)');

  const checkboxSelector = '.agreement__container input[type="checkbox"]';
  await page.waitForSelector(checkboxSelector);
  const isAgreed = await page.$eval(checkboxSelector, el => {
    console.log('isChecked', el.TAGNAME, el.checked);
    return el.checked === true;
  });
  if (!isAgreed) {
    console.log(checkboxSelector);
    await page.click(checkboxSelector, { delay });
  }

  page.screenshot({
    path: `${directory}/agreement.png`,
    fullPage: true,
  });

  try {
    await page.click('button::-p-text(Submit)', { delay });
  } catch (err) {
    console.log('Silent fail', err);
  }

  await page.waitForSelector('button::-p-text(Print)');

  page.screenshot({
    path: `${directory}/submit.png`,
    fullPage: true,
  });

  await browser.close();
})();
