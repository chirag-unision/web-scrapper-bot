// const puppeteer = require('puppeteer');

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto('https://www.viagogo.com/Concert-Tickets/Pop-Music/Dua-Lipa-Tickets/E-155232025?quantity=2&sections=&ticketClasses=&rows=&seats=&seatTypes=&listingQty=');

//     const content = await page.evaluate(() => {
//         return document.body.innerText;
//     });

    
//     const regex= /INR\d{1,3}(,\d{3})*/g;
//     const data = content.match(regex);
//     console.log(data);
    
//     await browser.close();
// })();

//waitForSelector



const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');

const path = 'example.txt';

async function init () {
  let driver = await new Builder().forBrowser('chrome').build();
  const url= 'https://www.ticombo.com/en/sports-tickets/undefined-tickets/73c9e99b-74dd-4b0a-9ec5-c40d2c99b7e5/73c9e99b-74dd-4b0a-9ec5-c40d2c99b7e5';

  try {
    await driver.get(url);
    await driver.wait(until.elementLocated(By.tagName('body')), 10000);
    let content = await driver.findElement(By.tagName('body')).getText();

    const regex= /€\d{1,3}(,\d{3})*/g;
    const data = content.match(regex);
    console.log(data);

    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(path, data.toString(), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing file:', writeErr);
                } else {
                    console.log('File written successfully.');
                }
            });
        } else {
            fs.readFile(path, 'utf8', (readErr, content) => {
                if (readErr) {
                    console.error('Error reading file:', readErr);
                } else {
                    if(data.toString()==content) {
                        console.log('File contents:', content);
                    } else {
                        console.log('File has changed! Rewriting...');
                        fs.writeFile(path, data.toString(), (writeErr) => {
                            if (writeErr) {
                                console.error('Error writing file:', writeErr);
                            } else {
                                console.log('File written successfully.');
                            }
                        });
                    }
                }
            });
        }

        setTimeout(() => {
            init();
        }, 10000);
    });

  } finally {
    await driver.quit();
  }
};


init();


// const regex= /INR\d{1,3}(,\d{3})*/g;
// const data = pageText.match(regex);
// console.log(data);