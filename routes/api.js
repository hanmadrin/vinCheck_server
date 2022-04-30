const express = require('express');
const login = require('../controllers/login');
const isLoggedIn = require('../controllers/isLoggedIn');
const logout = require('../controllers/logout');
const router = express.Router();

router.get('/download',viewPDF);
router.use('/',(req,res)=>{console.log('wrong api url');res.sendStatus(404);});

module.exports=router;