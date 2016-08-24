//Requires necessários
var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var dbConnection = require('../api/lib/dbConnection');
var devShop = require('../api/developer-shop');
var server = require('../../server');
//var request = require('supertest');

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

    it('Verificar a resposta HTTP para o post do novo pedido', function(done){

        done('erro');
    });
});