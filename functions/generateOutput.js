const puppeteer = require('puppeteer');
const fs = require('fs');
const csvTOjson = require('csvtojson');
const { Parser } = require('json2csv');
const scrapData = require('./functions/scrapeData');
const scrapData = require('./scrapeData');
const generateOutput= async()=>{
    const jsonData = await csvTOjson().fromFile(path.join(__dirname, 'input.csv'));
    const vins = jsonData.map(el=>el['Vin#']);
    const keys = Object.keys(jsonData[0]);

    const values = await scrapData({vins});
    for(let i=0;i<vins.length;i++){
        jsonData[i]['Accident Count'] = values[vins[i]]['accidentCount'];
        jsonData[i]['Brands Count'] = values[vins[i]]['titleBrands'];
        jsonData[i]['VIN Status'] = values[vins[i]]['status'];
    }

    const fields = [];
    for(let i=-0;i<keys.length;i++){
        if(keys[i]=='Vin#' && keys[i]!=='VIN Status' && keys[i]!=='Accident Count' && keys[i]!=='Title Brands'){
            fields.push(keys[i]);
            fields.push('VIN Status')
            fields.push('Accident Count');
            fields.push('Brands Count');
        }else{
            fields.push(keys[i]);
        }
    }
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(jsonData);
    fs.writeFileSync(path.join(__dirname, 'output.csv'), csv);    
};
module.exports = generateOutput;