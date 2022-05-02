const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const csvTOjson = require('csvtojson');
const { Parser } = require('json2csv');
const VIN = require('../models/VIN');
const path = require('path');
const generateOutput= async()=>{
    const jsonData = await csvTOjson().fromFile(path.join(__dirname, '../input.csv'));
    const vins = jsonData.map(el=>el['Vin#']);
    const keys = Object.keys(jsonData[0]);

    for(let i=0;i<vins.length;i++){
        const vinDb = await VIN.findOne({where:{vin: vins[i]}});
        if(vinDb==null){
            jsonData[i]['Accident Count'] = vinDb[0]['accident_count'];
            jsonData[i]['Problems Count'] = vinDb[0]['problem_count'];
            jsonData[i]['VIN Status'] = vinDb[0]['status'];
        }
        
    }

    const fields = [];
    for(let i=-0;i<keys.length;i++){
        if(keys[i]=='Vin#' && keys[i]!=='VIN Status' && keys[i]!=='Accident Count' && keys[i]!=='Title Brands'){
            fields.push(keys[i]);
            fields.push('VIN Status')
            fields.push('Accident Count');
            fields.push('Problems Count');
        }else{
            fields.push(keys[i]);
        }
    }
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(jsonData);
    await fsPromises.writeFile(path.join(__dirname, '../output.csv'), csv);
    await fsPromises.unlink(path.join(__dirname, '../input.csv'));
};
module.exports = generateOutput;