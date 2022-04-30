const express = require('express');
const http = require('http');
const cookieParser = require("cookie-parser");
const formidable = require('express-formidable');
const app = express();
const path = require('path');
const server = http.createServer(app);

app.use(cookieParser());
app.use(formidable());
app.use('/public',express.static('./public'));
app.use('/', function(req, res) {
    res.sendFile('public/index.html', {root: __dirname});
});

server.listen(7070);

