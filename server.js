const express = require('express');
const http = require('http');
const cookieParser = require("cookie-parser");
const formidable = require('express-formidable');
const app = express();
const path = require('path');
const server = http.createServer(app);


const puppeteer = require('puppeteer');
const scrapeData = async (vin,mileage)=> {
    const sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms));}
    const browser = await puppeteer.launch({ 
        headless: true,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    const kbb = await browser.newPage();
    await kbb.evaluateOnNewDocument(async() => {
        delete navigator.__proto__.webdriver;
    });
    let reTry = true;
    while(reTry){
        try{
            await kbb.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
            await kbb.goto('https://www.kbb.com/whats-my-car-worth/', { waitUntil: 'networkidle0' });
            
            // const data = await kbb.evaluate(() => document.querySelector('*').outerHTML);
            // console.log(data);
            await kbb.waitForSelector('#vinNumberInput');
            const vinInput = await kbb.$('#vinNumberInput input');
            const submit = await kbb.$('button[data-testid="vinSubmitBtn"]');
            console.log(`typing vin:${vin}`);
            await vinInput.type(vin);
            await submit.click();
            await sleep(1000);
            const invalid = await kbb.$('#vinNumberInput span.css-tiv2r2-StyledError.e2plhlo1');
            console.log('choosing engine & transmission');
            if(invalid!=null){
                return {
                    kbb_year: '',
                    kbb_vehicle: '',
                    kbb_engine_trim: '',
                    kbb_tradeInValue: '',
                };
            }else{
                await kbb.waitForSelector('#category');
                const engine = await kbb.$('#engine');
                const transmission = await kbb.$('#transmission');
                if(await engine.$('select')!=null){
                    const select = await engine.$('select');
                    const options = await select.$$('option');
                    const firstValue = await options[1].evaluate(el=>el.value);
                    await kbb.select('#engine select', firstValue);
                }
                if(await transmission.$('select')!=null){
                    const select = await transmission.$('select');
                    const options = await select.$$('option');
                    const firstValue = await options[1].evaluate(el=>el.value);
                    await kbb.select('#transmission select', firstValue);
                    for(let i=1; i<options.length; i++){
                        const value = await options[i].evaluate(el=>el.value);
                        if(!value.includes('manual') && !value.includes('Manual')){
                            await kbb.select('#transmission select', value);
                            break;
                        }
                    }
                }

                console.log('entering mileage & zipcode');
                await kbb.waitForSelector('[data-lean-auto="mileageInput"]');
                const mileageInput = await kbb.$('[data-lean-auto="mileageInput"]');
                const zipCodeInput = await kbb.$('[data-lean-auto="zipcodeInput"]');
                await mileageInput.type(mileage);
                await zipCodeInput.type('16917');
                await sleep(1000);
                const firstPageNextButton = await kbb.$('button[data-cy="vinLpNext"]');
                await firstPageNextButton.click();
                console.log('choosing price statndard');
                await kbb.waitForSelector('#pricestandard');
                const priceStandard = await kbb.$('#pricestandard');
                priceStandard.click();
                console.log('choosing color');
                await kbb.waitForSelector('[data-lean-auto="colorPicker_White"]');
                const colorPickerWhite = await kbb.$('[data-lean-auto="colorPicker_White"]');
                await colorPickerWhite.click();
                const secondPageNextButton = await kbb.$('button[data-lean-auto="optionsNextButton"]');
                await secondPageNextButton.click();
        
                try{
                    console.log('choosing default price option');
                    await kbb.waitForSelector('[data-lean-auto="next-btn"]');
                    const thirdPageNextButton = await kbb.$('[data-lean-auto="next-btn"]');
                    await thirdPageNextButton.click();
                }catch(e){
                    console.log('no default price option');
                }
                console.log('choosing condition');
                await kbb.waitForSelector('[data-lean-auto="good"]');
                const good = await kbb.$('[data-lean-auto="good"]');
                await good.click();
                const fourthPageNextButton = await kbb.$('button[data-lean-auto="optionsNextButton"]');
                await fourthPageNextButton.click();
                console.log('clicking quick link');
                await kbb.waitForSelector('[data-lean-auto="quick-link"]');
                const quickLink = await kbb.$('[data-lean-auto="quick-link"]');
                await quickLink.click();
        
                await kbb.waitForSelector('[name="tradeInValue"]');
                await sleep(1000);
                console.log('scraping data');
                const tradeInValue = await (await kbb.$('[name="tradeInValue"]')).evaluate(el=>el.value);
                const vehicleDetails = await (await kbb.$('.css-1ceovnz-HeaderAndLabel h1')).evaluate(el=>el.innerText);
                const year = vehicleDetails.split(' ')[0];
                const vehicle = vehicleDetails.replace(year, '').trim();
                const engineTrim = await (await kbb.$('.css-1ceovnz-HeaderAndLabel p')).evaluate(el=>el.innerText);
                reTry = false;
                const result =  {
                    kbb_year: year,
                    kbb_vehicle: vehicle,
                    kbb_engine_trim: engineTrim,
                    kbb_tradeInValue: tradeInValue,
                };
                console.log(result);
                return result;
            }
        }catch(e){
            console.log('failed once');
        }
    }
    

}
const vins = [
    "5NPD74LFXHH194636",//transmission*
    "19XFC1E38HE021370",//engine*
    "5XXGV4L22HG156698",
    "5YFBURHEXHP619482",//style
    "1C4BJWDG5HL692380",//style,transmission*
    "3VWFD7AT6KM709125",//category,style
];
// scrapeData(vins[0],'50000');








app.use(cookieParser());
app.use(formidable());
app.use('/public',express.static('./public'));
app.use('/api', require('./routes/api'))
app.use('/', function(req, res) {
    res.sendFile('public/index.html', {root: __dirname});
});

server.listen(7070);

