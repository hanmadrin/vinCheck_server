const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const VIN = require('../models/VIN');
const generateOutput = require('./generateOutput');
const scrapData = async ()=> {
    const values = {};
    const sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms));}
    const browser = await puppeteer.launch({ 
        headless: true,
        // args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    try{
        const vincheck = await browser.newPage();
        await vincheck.goto('https://www.autocheck.com/members/login.do');
        await vincheck.waitForSelector('#loginform');
        const form = await vincheck.$('#loginform');
        const username = await form.$('#username');
        const password = await form.$('#password');
        const login = await form.$('input[type="submit"]');
        await username.type('5024533');
        await password.type('matthews2');
        await login.click();
        await vincheck.waitForNavigation();

        const kbb = await browser.newPage();
        await kbb.evaluateOnNewDocument(async() => {
            delete navigator.__proto__.webdriver;
        });
        await sleep(1000);
        await vincheck.bringToFront();
        const vins = await VIN.findAll({where:{status: null}});
        if(vins.length !== 0){
            for(let i = 0; i < vins.length; i++){
                const form = await vincheck.$('#singleVin');
                const vin = await form.$('#vin');
                const submit = await form.$('[name="fullButton"]');
                await vin.type(vins[i].vin);
                await submit.click();
                await vincheck.waitForNavigation();
                let accidentCount = '';
                const accidentImg = await vincheck.$('[src="https://www.autocheck.com/reportservice/report/fullReport/img/accident-found.svg"]');

                if(accidentImg!=null){
                    accidentCount = await accidentImg.evaluate(el=>{
                        const accidentHolder = el.parentElement.parentElement;
                        const accidentCount = accidentHolder.querySelector('.accident-count');
                        return accidentCount.innerText;
                    });
                }else{
                    accidentCount = '0';
                }
                const invalid = await vincheck.$('#singleVin p.alert.alert-danger');
                const titleBrands = await vincheck.evaluate(async()=>{
                    const tableBody = document.querySelectorAll('.title-brand-table > .table_icon > .rTableRow');

                    let brandsCount = 0;
                    for(let i=0; i<tableBody.length; i++){
                        console.log(tableBody[i].querySelector('img').getAttribute('src')); 
                        if(tableBody[i].querySelector('img').getAttribute('src') !== 'https://www.autocheck.com/reportservice/report/fullReport/img/check-icon.svg'){
                            brandsCount++;
                        }
                    }
                    // const sleep = async(milliseconds) => {
                    //     return new Promise(resolve => setTimeout(resolve, milliseconds))
                    // }
                    // await sleep(10000);
                    return brandsCount;
                });
                values.accident_count =invalid==null?accidentCount:'';
                values.problem_count = invalid==null?titleBrands:'';
                values.status = invalid==null?'success':'invalid';
                await sleep(1000);
                await kbb.bringToFront();
                let reTry = true;
                while(reTry){
                    try{
                        await kbb.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
                        await kbb.goto('https://www.kbb.com/whats-my-car-worth/', { waitUntil: 'networkidle0' });
                        // console.lo
                        // const data = await kbb.evaluate(() => document.querySelector('*').outerHTML);
                        // console.log(data);
                        await kbb.waitForSelector('#vinNumberInput');
                        const vinInput = await kbb.$('#vinNumberInput input');
                        const submit = await kbb.$('button[data-testid="vinSubmitBtn"]');
                        console.log(`typing vin:${vins[i].vin}`);
                        await vinInput.type(vins[i].vin);
                        await submit.click();
                        await sleep(1000);
                        const invalid = await kbb.$('#vinNumberInput span.css-tiv2r2-StyledError.e2plhlo1');
                        console.log('choosing engine & transmission');
                        if(invalid!=null){
                            // return {
                                values.kbb_year= '';
                                values.kbb_vehicle= '';
                                values.kbb_engine_trim= '';
                                values.kbb_tradeInValue= '';
                                reTry = false;
                            // };
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
                            await mileageInput.type(vins[i].mileage);
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
                            // const result =  {
                                values.kbb_year= year;
                                values.kbb_vehicle= vehicle;
                                values.kbb_engine_trim= engineTrim;
                                values.kbb_tradeInValue= tradeInValue;
                            // };
                            // console.log(result);
                            // return result;
                        }
                    }catch(e){
                        console.log(e);
                        console.log('failed once');
                    }
                }
                await sleep(1000);
                await vincheck.bringToFront();
                // const values = {
                //     accident_count: invalid==null?accidentCount:'',
                //     problem_count: invalid==null?titleBrands:'',
                //     status: invalid==null?'success':'invalid'
                // };
                await VIN.update(values,{where:{vin: vins[i].vin}});
                await vincheck.goto('https://www.autocheck.com/members/singleVinSearch.do');
                await vincheck.waitForSelector('#singleVin');  
            }
        }
    }catch(err){
        console.log(err);
    }finally{
        await browser.close();
        const leftVin = await VIN.findAll({where:{status: null}});
        if(leftVin.length == 0){
            await generateOutput();
        }
    }
    
    
       
        
        
       
            

            
};
module.exports = scrapData;