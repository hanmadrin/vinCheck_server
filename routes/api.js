const express = require('express');
const login = require('../controllers/login');
const isLoggedIn = require('../controllers/isLoggedIn');
const logout = require('../controllers/logout');
const authMiddleware = require('../controllers/authMiddleware');
const fileUpload = require('../controllers/fileUpload');
const situation = require('../controllers/situation');
const reset = require('../controllers/reset');
const download = require('../controllers/download');
const router = express.Router();
const puppeteer = require('puppeteer');


router.post('/login', login);
router.get('/isLoggedIn',isLoggedIn);
// router.use('/',authMiddleware);
router.get('/logout',logout);

router.post('/reset',reset);
router.get('/situation',situation)
router.post('/fileUpload',fileUpload);
router.get('/download',download);


router.use('/',(req,res)=>{console.log('wrong api url');res.sendStatus(404);});

module.exports=router;