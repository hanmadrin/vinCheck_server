const express = require('express');
const http = require('http');
const cookieParser = require("cookie-parser");
const formidable = require('express-formidable');
const app = express();
const path = require('path');
const server = http.createServer(app);
const scrapeDataNew = require('./functions/scrapeDataNew.js');
const Meta = require('./models/Meta');
const puppeteer = require('puppeteer');

(async () => {
    
    app.use(cookieParser());
    app.use(formidable());
    app.use('/public',express.static('./public'));
    app.use('/api', require('./routes/api'))
    app.get("/puppet/restart", async (req, res) => {
        res.json();
        let browser;
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        try{
            browser = await puppeteer.launch({
                headless: false, args: ['--no-sandbox'],
                defaultViewport: {
                    width: 1920,
                    height: 1080
                }
            });
            await sleep(5000);
            const page = await browser.newPage();
            scrapeDataNew(page);
        }catch(e) { 
            //console.log('error');
            await sleep(2000);
        }
    })
    app.use('/', function(req, res) {
        res.sendFile('public/index.html', {root: __dirname});
    });
    
    server.listen(7070);
})();












