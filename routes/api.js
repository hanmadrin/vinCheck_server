const express = require('express');

const fileUpload = require('../controllers/fileUpload');
const situation = require('../controllers/situation');
const restart = require('../controllers/restart');
const reset = require('../controllers/reset');
const download = require('../controllers/download');
const router = express.Router();
const puppeteer = require('puppeteer');
const VIN = require('../models/VIN');


router.post('/vin/skip/:vin', async (req, res) => {
    const vin = req.params.vin;
    const vinObj = await VIN.findOne({where: {vin}});
    if(vinObj) {
        if(vinObj.status===null) {
            vinObj.status = 'skipped';
        }
        if(vinObj.kbb_status===null) {
            vinObj.kbb_status = 'skipped';
        }
        await vinObj.save();
    }
});
router.post('/reset',reset);
router.post('/restart',restart);
router.get('/situation',situation)
router.post('/fileUpload',fileUpload);
router.get('/download',download);


router.use('/',(req,res)=>{console.log('wrong api url');res.sendStatus(404);});

module.exports=router;