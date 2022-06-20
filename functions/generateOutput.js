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
    // console.log(vins.length);
    for(let i=0;i<vins.length;i++){
        const vinDb = await VIN.findOne({where:{vin: vins[i]}});
        if(vinDb!=null){
            // console.log(vinDb)
            jsonData[i]['Accident Count'] = `${vinDb.dataValues.accident_count}`;
            jsonData[i]['Problems Count'] = `${vinDb.dataValues.problem_count}`;
            jsonData[i]['VIN Status'] = vinDb.dataValues.status;
            jsonData[i]['KBB Year'] = vinDb.dataValues.kbb_year;
            jsonData[i]['KBB Vehicle'] = vinDb.dataValues.kbb_vehicle;
            jsonData[i]['KBB Engine_Trim'] = vinDb.dataValues.kbb_engine_trim;
            jsonData[i]['KBB Trade Value'] = vinDb.dataValues.kbb_tradeInValue;

        }
    }
    // console.log(jsonData);
    const fields = [];
    for(let i=-0;i<keys.length;i++){
        if(keys[i]=='Vin#' && keys[i]!=='VIN Status' && keys[i]!=='Accident Count' && keys[i]!=='Title Brands'){
            fields.push(keys[i]);
            fields.push('VIN Status')
            fields.push('Accident Count');
            fields.push('Problems Count');
            fields.push('KBB Year');
            fields.push('KBB Vehicle');
            fields.push('KBB Engine_Trim');
            fields.push('KBB Trade Value');
        }else{
            fields.push(keys[i]);
        }
    }
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(jsonData);
    return csv;
    // await fsPromises.writeFile(path.join(__dirname, '../output.csv'), csv);
    // await fsPromises.unlink(path.join(__dirname, '../input.csv'));
};
module.exports = generateOutput;