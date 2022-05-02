const fs = require('fs');
const path = require('path');
const VIN = require('../models/VIN');

const reset = async (req,res)=>{
    if(fs.existsSync('./input.csv')){
        fs.unlinkSync('./input.csv');
    }
    if(fs.existsSync('./output.csv')){
        fs.unlinkSync('./output.csv');
    }
    await VIN.sync({force: true});
    res.json();
};
module.exports = reset;