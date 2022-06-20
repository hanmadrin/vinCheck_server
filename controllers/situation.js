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

    const total = await VIN.count();

    const doneVin = await VIN.count({where:{status: {[Op.not]:null}}});
    const doneKbb = await VIN.count({where:{kbb_status: {[Op.not]:null}}});

    const leftVin = await VIN.count({where:{status: null}});
    const leftKbb = await VIN.count({where:{kbb_status: null}});
    const vins = await VIN.findAll();
   

    const leftTime = `${Math.floor((leftVin * 7 + leftKbb * 23)/3600)} hour  ${Math.floor(((leftVin * 7 + leftKbb * 23)%3600)/60)} min  ${Math.floor((leftVin * 7 + leftKbb * 23)%60)} sec`;
    
    res.json({
        total,
        doneVin,
        doneKbb,
        leftVin,
        leftKbb,
        leftTime,
        inputFileExists,
        vins
    });
};
module.exports = situation;