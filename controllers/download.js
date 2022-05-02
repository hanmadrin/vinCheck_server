const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;
const download = async(req,res)=>{
    const file = await fsPromises.readFile(path.join(__dirname,'../output.csv'),'utf8');
    res.setHeader('Content-disposition', 'attachment; filename=output.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(file);
};
module.exports = download;