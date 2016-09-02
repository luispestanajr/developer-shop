var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();
var developerShop = require('./app/api/developer-shop');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {

    res.render('public/index')
});

app.post('/pedido', (req, res) => {

    developerShop.criarPedido(req.body.dataCriacao, req.body.codigoCupom, req.body.produtosPedido)
        .then((data) => {
            res.json({ "resposta": "ok" });
       })
    .catch((err) => {
        res.json({ "resposta": "erro" });
    });
});

app.listen(app.get('port'), () => {});

module.exports = app;