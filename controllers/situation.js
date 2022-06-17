const fs = require('fs');
const path = require('path');
const VIN = require('../models/VIN');
const Sequelize = require('sequelize');

const situation = async (req,res)=>{
    const Op = Sequelize.Op;
    const inputFileExists = fs.existsSync(path.join(__dirname,'../input.csv'));
    const outputFileExists = fs.existsSync(path.join(__dirname,'../output.csv'));

    // const leftVin = await VIN.count({where:{status: null}});
    // const leftKbb = await VIN.count({where:{kbb_status: null}});

    const totalVin = await VIN.count();

    const doneVin = await VIN.count({where:{status: {[Op.not]:null}}});
    const doneKbb = await VIN.count({where:{kbb_status: {[Op.not]:null}}});

    const leftVin = totalVin - doneVin;
    const leftKbb = totalVin - doneKbb;

    const finalDoneVin = Math.floor(doneVin * 0.3 + doneKbb * 0.7);

    const leftTime = `${Math.floor((leftVin * 7 + leftKbb * 23)/3600)} hour  ${Math.floor(((leftVin * 7 + leftKbb * 23)%3600)/60)} min  ${Math.floor((leftVin * 7 + leftKbb * 23)%60)} sec`;
    
    res.json({inputFileExists,outputFileExists,leftVin,totalVin,doneVin:finalDoneVin,leftTime});
};
module.exports = situation;