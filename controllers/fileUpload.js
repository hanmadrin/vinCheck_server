const VIN = require('../models/VIN');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const csvTOjson = require('csvtojson');
const scrapeData = require('../functions/scrapeData');
const scrapeDataNew = require('../functions/scrapeDataNew');
const fileUpload = async(req,res)=>{
    const file = req.files.file_upload;
    if(file==null){
        res.status(201).json({data:'You forgot to include file',type:'warning'});
        return null; 
    }else{
        if(file.size>5000000){
            res.status(201).json({data:'File size must be less than 5MB',type:'warning'});
            return null; 
        }else if(path.extname(file.name)!='.csv'){
            res.status(201).json({data:'Must be a CSV File(.pdf)',type:'warning'});
            return null; 
        }
    }
    const oldPath = file.path;
    const newPath = path.join(__dirname, '../input.csv');
    await fsPromises.copyFile(oldPath, newPath);
    const fileWithExtra = await fsPromises.readFile(newPath);
    const fileWithExtraArr = fileWithExtra.toString().split('\n');
    fileWithExtraArr.pop();
    fileWithExtraArr.pop();
    fileWithExtraArr.pop();
    fileWithExtraArr.pop();
    fileWithExtraArr.pop();
    fileWithExtraArr.shift();
    fileWithExtraArr.shift();
    fileWithExtraArr.shift();
    fileWithExtraArr.shift();
    const fileWithoutExtra = fileWithExtraArr.join('\n');
    await fsPromises.writeFile(newPath, fileWithoutExtra);
    const jsonData = await csvTOjson().fromFile(newPath);
    if(jsonData.length==0){
        res.status(201).json({data:'No data found in file',type:'warning'});
        return null; 
    }else{
        if(jsonData[0]['Vin#']==undefined){
            res.status(201).json({data:'Change File : "Vin#" not found',type:'warning'});
            await fsPromises.unlink(newPath);
            return null; 
        }
        if(jsonData[0]['Mileage']==undefined){
            res.status(201).json({data:'Change File : "Mileage" not found',type:'warning'});
            await fsPromises.unlink(newPath);
            return null;  
        }
    }

    const vins = jsonData.map(el=>{return {vin: el['Vin#'],mileage: el['Mileage']}});
    await VIN.bulkCreate(vins);
    scrapeDataNew();
    // scrapeData();
    res.json({vins});
};
module.exports = fileUpload;