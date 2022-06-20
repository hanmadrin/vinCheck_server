const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const VIN = require('../models/VIN');
const generateOutput = require('./generateOutput');
const scrapeDataNew = async(browserPage) => {
    const sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms));}
    const leftVin = await VIN.count({where:{status: null}});
    const leftKbb = await VIN.count({where:{kbb_status: null}});
    try{
        if(leftVin>0){
            await browserPage.goto('https://www.autocheck.com/members/login.do');
            await browserPage.waitForSelector('#loginform');
            const form = await browserPage.$('#loginform');
            const username = await form.$('#username');
            const password = await form.$('#password');
            const login = await form.$('input[type="submit"]');
            await username.type('5024533');
            await password.type('matthews2');
            await login.click();
            await browserPage.waitForNavigation();
    
            const vins = await VIN.findAll({where:{status: null}});
            for(let i = 0; i < vins.length; i++){
                const updatedVin = await VIN.findOne({where:{vin: vins[i].dataValues.vin}});
                if(updatedVin.status!='skipped'){
                    const values = {};
                    console.log(`${vins[i].vin}: processing started`);
                    const form = await browserPage.$('#singleVin');
                    const vin = await form.$('#vin');
                    const submit = await form.$('[name="fullButton"]');
                    console.log(`${vins[i].vin}: AUTOCHECK : Typing vin`);
                    await vin.type(vins[i].vin);
                    console.log(`${vins[i].vin}: AUTOCHECK : Submitting vin`);
                    await submit.click();
                    await browserPage.waitForNavigation();
                    console.log(`${vins[i].vin}: AUTOCHECK : Waiting for info page to load`);
                    let accidentCount = '';
                    const accidentImg = await browserPage.$('[src="https://www.autocheck.com/reportservice/report/fullReport/img/accident-found.svg"]');
                    console.log(`${vins[i].vin}: AUTOCHECK : Checking for accident`);
                    if(accidentImg!=null){
                        accidentCount = await accidentImg.evaluate(el=>{
                            const accidentHolder = el.parentElement.parentElement;
                            const accidentCount = accidentHolder.querySelector('.accident-count');
                            return accidentCount.innerText;
                        });
                        console.log(`${vins[i].vin}: AUTOCHECK : Accident found`);
                    }else{
                        accidentCount = '0';
                    }
                    const invalid = await browserPage.$('#singleVin p.alert.alert-danger');
                    const titleBrands = await browserPage.evaluate(async()=>{
                        const tableBody = document.querySelectorAll('.title-brand-table > .table_icon > .rTableRow');
        
                        let brandsCount = 0;
                        for(let i=0; i<tableBody.length; i++){
                            console.log(tableBody[i].querySelector('img').getAttribute('src')); 
                            if(tableBody[i].querySelector('img').getAttribute('src') !== 'https://www.autocheck.com/reportservice/report/fullReport/img/check-icon.svg'){
                                brandsCount++;
                            }
                        }
                        return brandsCount;
                    });
                    values.accident_count =invalid==null?accidentCount:'';
                    values.problem_count = invalid==null?titleBrands:'';
                    values.status = invalid==null?'success':'invalid';
                    if(invalid!=null){values.kbb_status= 'invalid';}
                    await VIN.update(values,{where:{vin: vins[i].vin}});
                    await browserPage.goto('https://www.autocheck.com/members/singleVinSearch.do');
                    await browserPage.waitForSelector('#singleVin');
                }                  
            }
        }
        if(leftKbb>0){
            const vins = await VIN.findAll({where:{kbb_status: null}});
            for(let i = 0; i < vins.length; i++){
                const updatedVin = await VIN.findOne({where:{vin: vins[i].dataValues.vin}});
                if(updatedVin.kbb_status!='skipped'){
                    const values = {};
                    await browserPage.evaluateOnNewDocument(async() => {
                        delete navigator.__proto__.webdriver;
                    });
                    
                    let reTry = true;
                    let reTryCount = 0;
                    while(reTry){
                        try{
                            await browserPage.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
                            await browserPage.goto('https://www.kbb.com/whats-my-car-worth/');
                            
        
                            console.log(`${vins[i].vin}: KBB : Typing vin`);
                            await browserPage.waitForSelector('#vinNumberInput',{timeout:5000});
                            const vinInput = await browserPage.$('#vinNumberInput input');
                            const submit = await browserPage.$('button[data-testid="vinSubmitBtn"]');
                            
                            await vinInput.type(vins[i].vin);
                            console.log(`${vins[i].vin}: KBB : Submittion vin`);
                            await submit.click();
                            await sleep(1000);
                            const invalid = await browserPage.$('#vinNumberInput span.css-tiv2r2-StyledError.e2plhlo1');
                            console.log(`${vins[i].vin}: KBB : Choosing  Engine & Transmission`);
                            if(invalid!=null){
                                console.log(`${vins[i].vin}: KBB : Invalid vin`);
                                    values.kbb_status = 'invalid';
                                    values.kbb_year= '';
                                    values.kbb_vehicle= '';
                                    values.kbb_engine_trim= '';
                                    values.kbb_tradeInValue= '';
                                    reTry = false;
                            }else{
                                console.log(`${vins[i].vin}: KBB : Choosing  category`);
                                await browserPage.waitForSelector('#category',{timeout:5000});
                                const engine = await browserPage.$('#engine');
                                const transmission = await browserPage.$('#transmission');
                                if(await engine.$('select')!=null){
                                    const select = await engine.$('select');
                                    const options = await select.$$('option');
                                    const firstValue = await options[1].evaluate(el=>el.value);
                                    await browserPage.select('#engine select', firstValue);
                                }
                                if(await transmission.$('select')!=null){
                                    const select = await transmission.$('select');
                                    const options = await select.$$('option');
                                    const firstValue = await options[1].evaluate(el=>el.value);
                                    await browserPage.select('#transmission select', firstValue);
                                    for(let i=1; i<options.length; i++){
                                        const value = await options[i].evaluate(el=>el.value);
                                        if(!value.includes('manual') && !value.includes('Manual')){
                                            await browserPage.select('#transmission select', value);
                                            break;
                                        }
                                    }
                                }
        
                                console.log(`${vins[i].vin}: KBB : Entering Mileage`);
                                await browserPage.waitForSelector('[data-lean-auto="mileageInput"]',{timeout:5000});
                                const mileageInput = await browserPage.$('[data-lean-auto="mileageInput"]');
                                const zipCodeInput = await browserPage.$('[data-lean-auto="zipcodeInput"]');
                                await mileageInput.type(vins[i].mileage);
                                await zipCodeInput.type('16917');
                                await sleep(1000);
                                const firstPageNextButton = await browserPage.$('button[data-cy="vinLpNext"]');
                                await firstPageNextButton.click();
                                console.log(`${vins[i].vin}: KBB : Choosing  Standard Price`);
                                await browserPage.waitForSelector('#pricestandard',{timeout:5000});
                                const priceStandard = await browserPage.$('#pricestandard');
                                priceStandard.click();
                                console.log(`${vins[i].vin}: KBB : Choosing  Color`);
                                await browserPage.waitForSelector('[data-lean-auto="colorPicker_White"]',{timeout:5000});
                                const colorPickerWhite = await browserPage.$('[data-lean-auto="colorPicker_White"]');
                                await colorPickerWhite.click();
                                const secondPageNextButton = await browserPage.$('button[data-lean-auto="optionsNextButton"]');
                                await secondPageNextButton.click();
                        
                                try{
                                    console.log(`${vins[i].vin}: KBB : Choosing Default Price Options`);
                                    await browserPage.waitForSelector('[data-lean-auto="next-btn"]',{timeout:5000});
                                    const thirdPageNextButton = await browserPage.$('[data-lean-auto="next-btn"]');
                                    await thirdPageNextButton.click();
                                }catch(e){
                                    console.log(`${vins[i].vin}: KBB : No Default Price Options`);
                                }
                                console.log(`${vins[i].vin}: KBB : Choosing condition "Good"`);
                                await browserPage.waitForSelector('[data-lean-auto="good"]',{timeout:5000});
                                const good = await browserPage.$('[data-lean-auto="good"]');
                                await good.click();
                                const fourthPageNextButton = await browserPage.$('button[data-lean-auto="optionsNextButton"]');
                                await fourthPageNextButton.click();
                                console.log(`${vins[i].vin}: KBB : Clicking Quick Link`);
                                await browserPage.waitForSelector('[data-lean-auto="quick-link"]',{timeout:5000});
                                const quickLink = await browserPage.$('[data-lean-auto="quick-link"]');
                                await quickLink.click();
                                console.log(`${vins[i].vin}: KBB : waiting for trande value to appear`);
                                await browserPage.waitForSelector('[name="tradeInValue"]',{timeout:5000});
                                await sleep(1000);
                                console.log(`${vins[i].vin}: KBB : Scraping Data`);
                                const tradeInValue = await (await browserPage.$('[name="tradeInValue"]')).evaluate(el=>el.value);
                                const vehicleDetails = await (await browserPage.$('.css-1ceovnz-HeaderAndLabel h1')).evaluate(el=>el.innerText);
                                const year = vehicleDetails.split(' ')[0];
                                const vehicle = vehicleDetails.replace(year, '').trim();
                                const engineTrim = await (await browserPage.$('.css-1ceovnz-HeaderAndLabel p')).evaluate(el=>el.innerText);
                                reTry = false;
                                values.kbb_status = 'success';
                                values.kbb_year= year;
                                values.kbb_vehicle= vehicle;
                                values.kbb_engine_trim= engineTrim;
                                values.kbb_tradeInValue= tradeInValue;
                                await VIN.update(values,{where:{vin: vins[i].vin}});
                            }
                        }catch(e){
                            await sleep(1000);
                            reTryCount++;
                            if(reTryCount>=5){
                                const vales = {};
                                values.failed = reTryCount;
                                await VIN.update(values,{where:{vin: vins[i].vin}});
                                reTry = false;
                            }
                            console.log(`${vins[i].vin}: KBB : Attempt failed. Will Try again!`);
                        }
                    }
                }
            }
        }
    }catch(e){
        console.log('error on scraping');
    }


};
module.exports = scrapeDataNew;