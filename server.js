var http = require('http');
var express = require('express');

var app = express();
var router = express.Router();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


app.use(function(req, res, next){
	//Full access to all, it is very bad idea. Use this only for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    next();
});

app.get('/', function(req, res) {
    //res.sendfile('public/index.html');
    res.render('public/index')
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});