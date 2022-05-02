const fs = require('fs');
const path = require('path');
const VIN = require('../models/VIN');
const Sequelize = require('sequelize');

const situation = async (req,res)=>{
    const Op = Sequelize.Op;
    const inputFileExists = fs.existsSync(path.join(__dirname,'../input.csv'));
    const outputFileExists = fs.existsSync(path.join(__dirname,'../output.csv'));
    const leftVin = await VIN.count({where:{status: null}});
    const totalVin = await VIN.count();
    const doneVin = await VIN.count({where:{status: {[Op.not]:null}}});

    res.json({inputFileExists,outputFileExists,leftVin,totalVin,doneVin});
};
module.exports = situation;