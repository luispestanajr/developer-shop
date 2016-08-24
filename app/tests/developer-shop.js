//Requires necessários
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var chaiHttp = require('chai-http');
var should = chai.should();

var dbConnection = require('../api/lib/dbConnection');
var devShop = require('../api/developer-shop');
var server = require('../../server');

chai.use(chaiHttp);

describe('Developer Shop', function() {

    before(function(done){

        expect(dbConnection.open()).to.be.true;
        done();
    });

    after(function(){
        expect(dbConnection.close()).to.be.true;
    })

    it('Verificar objeto de conexão a base de dados não é nulo', function(done){

        expect(dbConnection).to.not.be.null;
        done();
    });

    it('Verificar se conseguimos criar um novo pedido na base de dados', function(){

        var objNovoPedido = devShop.criarPedido(new Date(), "SHIPIT", [
                                                                                {
                                                                                    "idDesenvolvedor": "284515",
                                                                                    "valPreco": "92.7",
                                                                                    "qtdHoras": "5"
                                                                                },
                                                                                {
                                                                                    "idDesenvolvedor": "875888",
                                                                                    "valPreco": "2.4",
                                                                                    "qtdHoras": "55"
                                                                                }]);
        return objNovoPedido.then(function (data){

            expect(data).not.be.null;
        });
    });

    it('Verificar a resposta Http para a home do sistema', (done) => {

        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('Verificar a resposta Http para o post de novo pedido', function(done){

        var novoPedido = {
                            "dataCriacao": new Date(),
                            "codigoCupom": "SHIPIT",
                            "produtosPedido": [{ "idDesenvolvedor": "284515", "valPreco": "92.7",  "qtdHoras": "175" }
                                                ,{ "idDesenvolvedor": "875888",  "valPreco": "2.4",  "qtdHoras": "55" }]
                        };

        chai.request(server)
            .post('/pedido')
            .send(novoPedido)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.resposta.should.equal("ok");
                done();
            });
    });
});