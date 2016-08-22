'use strict';

var http = require('http');
var express = require('express');

var app = express();
var router = express.Router();

app.use(express.static('public'));

app.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

app.get('/', function(req, res) {
    res.sendfile('public/index.html');
});

//app.post('/enviar-contato', mail.enviaEmail);

app.listen(80);