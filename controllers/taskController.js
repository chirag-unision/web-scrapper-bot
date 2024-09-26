const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const cron= require('node-cron');
const TelegramBot = require('node-telegram-bot-api');

const token = '7355257692:AAF_VQykPbpgFfvXRhTKlYZ62aDcY-sCURw';
const bot = new TelegramBot(token, { polling: true });

let userInputs = { step: 0, input1: '', input2: '', input3: '' };

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Please provide the url:");
    userInputs.step = 1;
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (userInputs.step === 1) {
        userInputs.input1 = text;
        bot.sendMessage(chatId, "Please provide the currency symbol:");
        userInputs.step = 2;
    } else if (userInputs.step === 2) {
        userInputs.input2 = text;
        bot.sendMessage(chatId, "Please provide the time interval in minutes:");
        userInputs.step = 3;
    } else if (userInputs.step === 3) {
        userInputs.input3 = text;
        
        // Call the function with the inputs
        bot.sendMessage(chatId, "Thank you! You will be receiving updates..");
        myFunction(userInputs.input1, userInputs.input2, userInputs.input3, chatId);

        // Reset inputs
        userInputs = { step: 0, input1: '', input2: '', input3: '' };
    }
});

function myFunction(input1, input2, input3, chatId) {
    console.log(`Input 1: ${input1}, Input 2: ${input2}, Input 3: ${input3}`);

    const url = input1;
    const currency = input2;
    const interval = "*/"+input3+" * * * *";
    let name= url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)[1];
    cron.schedule(interval, () => {
        init(url, currency, name, chatId);
    })
    console.log('Automation Created!');
}


const fileHandling= (path, input, url, chatId)=> {
    input= input!=null?input:"";
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(path, input?.toString(), (writeErr) => {
                if (writeErr) {
                    console.error('Error writing file:', writeErr);
                } else {
                    console.log('File written successfully.');
                }
            });
        } else {
            fs.readFile(path, 'utf8', (readErr, data) => {
                if (readErr) {
                    console.error('Error reading file:', readErr);
                } else {
                    if(input?.toString()==data) {
                        console.log('File contents:', data);
                    } else if(input!="") {
                        console.log('File has changed! Rewriting...');
                        bot.sendMessage(chatId, '⚠️Alert! \nChange detected at '+url);
                        fs.writeFile(path, input?.toString(), (writeErr) => {
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
    });
}

const init= async (url, currency, name, chatId) => {

    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get(url);
        await driver.wait(until.elementLocated(By.tagName('body')), 20000);
        await driver.executeScript('window.scrollTo(0, document.body.scrollHeight);');
        let content = await driver.findElement(By.tagName('body')).getText();
    
        // const regex= /€\d{1,3}(,\d{3})*/g;
        const regex = new RegExp(`${currency}\\d{1,3}(,\\d{3})*`, 'g');
        const data = content.match(regex);
        console.log(data);

        const path= name;

        fileHandling(path, data, url, chatId);
    
      } finally {
        // await driver.manage().deleteAllCookies();
        await driver.quit();
      }
}

exports.scheduleEvent = async (req, res) => {
    const { url, currency, interval } = req.body;
    const format= "*/"+interval+" * * * *";
    let name= url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)[1];
    cron.schedule(format, () => {
        init(url, currency, name, 5025063742);
    })
    res.status(200).send('Automation Created!');
}