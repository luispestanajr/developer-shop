//Requires utilizados pelo módulo
var dbConnection = require('./lib/dbConnection');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Construtor do módulo
var developerShop = function(){

    //Definindo o tipo de promisse que vamos usar no Mongoose
    mongoose.Promise = global.Promise;

    //Definindo o nosso schema da base de pedidos
    pedidoSchema = new Schema({
        dataCriacao: Date,
        codigoCupom: String,
        produtosPedido: Array
    });
};

//Método responsável por criar um novo pedido na base de dados
developerShop.prototype.criarPedido = function(dataCriacao, codigoCupom, produtosPedido){

    //Abrir a conexão
    dbConnection.open();

    //Atribuição do nosso model
    var pedidoModel = mongoose.model('Pedidos', pedidoSchema);

    //Criação do objeto de pedido
    var pedido =  new pedidoModel({ "dataCriacao": dataCriacao,
                                    "codigoCupom": codigoCupom,
                                    "produtosPedido": produtosPedido});

    //Retornar uma promessa de save na base de dados
    return new Promise(function(resolve, reject){

        //Chamando o método save do Schema
        pedido.save()
            .catch(function(err) {
                dbConnection.close(); //Fechando conexão
                reject(err); //Rejeitando e retornando erro
            })
            .then(function() {
                dbConnection.close(); //Fechando conexão
                resolve('ok'); //Retorno de pedido criado com sucesso
            });
    });
}

//Exportando nosso modulo da App DeveloperShop
module.exports = new developerShop();
