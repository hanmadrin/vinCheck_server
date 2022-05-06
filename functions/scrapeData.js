const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const VIN = require('../models/VIN');
const generateOutput = require('./generateOutput');
const scrapData = async ()=> {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    try{
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
        const vins = await VIN.findAll({where:{status: null}});
        if(vins.length !== 0){
            for(let i = 0; i < vins.length; i++){
                const form = await page.$('#singleVin');
                const vin = await form.$('#vin');
                const submit = await form.$('[name="fullButton"]');
                await vin.type(vins[i].vin);
                await submit.click();
                await page.waitForNavigation();
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
                const titleBrands = await page.evaluate(async()=>{
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
                // console.log(titleBrands);
                const values = {
                    accident_count: invalid==null?accidentCount:'',
                    problem_count: invalid==null?titleBrands:'',
                    status: invalid==null?'success':'invalid'
                };
                await VIN.update(values,{where:{vin: vins[i].vin}});
                await page.goto('https://www.autocheck.com/members/singleVinSearch.do');
                await page.waitForSelector('#singleVin');  
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