const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const scrapData = async ({vins})=> {
    const browser = await puppeteer.launch({ 
        headless: true,
        defaultViewport: {
            width:1920,
            height:1080
        }
    });
    const page = await browser.newPage();
    await page.goto('https://www.autocheck.com/members/login.do');
    await page.waitForSelector('#loginform');
    const form = await page.$('#loginform');
    const username = await form.$('#username');
    const password = await form.$('#password');
    const login = await form.$('input[type="submit"]');
    await username.type('5024533');
    await password.type('matthews2');
    await login.click();
    await page.waitForNavigation();
    const values = {};
    for(let i=0; i<vins.length; i++){
        const form = await page.$('#singleVin');
        const vin = await form.$('#vin');
        const submit = await form.$('[name="fullButton"]');
        await vin.type(vins[i]);
        await submit.click();
        await page.waitForNavigation();
        // try{
            let accidentCount = '';
            const accidentImg = await page.$('[src="https://www.autocheck.com/reportservice/report/fullReport/img/accident-found.svg"]');

            if(accidentImg!=null){
                accidentCount = await accidentImg.evaluate(el=>{
                    const accidentHolder = el.parentElement.parentElement;
                    const accidentCount = accidentHolder.querySelector('.accident-count');
                    return accidentCount.innerText;
                });
            }else{
                accidentCount = '0';
            }
            const invalid = await page.$('#singleVin p.alert.alert-danger');
            const titleBrands = await page.evaluate(()=>{
                const tableBody = document.querySelectorAll('.title-brand-table > .table_icon > .rTableRow');
                
                // const brands = [];
                let brandsCount = 0;
                for(let i=0; i<tableBody.length; i++){
                    if(tableBody[i].querySelector('img').getAttribute('src') != 'https://www.autocheck.com/reportservice/report/fullReport/img/check-icon.svg'){
                        // brands.push(tableBody[i].innerText);
                        brandsCount++;
                    }
                }
                return brandsCount;
            });

            values[vins[i]] = {
                accidentCount: accidentCount,
                titleBrands: invalid==null?titleBrands:'',
                status: invalid==null?'success':'invalid'
            };
        // }catch(error){
        //     // console.log(error);
        //     values[vins[i]] = {
        //         'accidentCount': '',
        //         'titleBrands': '',
        //         'status': 'error',
        //     };
        // }
        await page.goto('https://www.autocheck.com/members/singleVinSearch.do');
        await page.waitForSelector('#singleVin');
    }
    console.log(values);
    await browser.close();
    return values;
};
module.exports = scrapData;