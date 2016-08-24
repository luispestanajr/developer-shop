//Requires utilizados pelo módulo
var config = require('../lib/config');
var mongoose = require('mongoose');

//Construtor do módulo
var dbConnection = function(){};

//Método responsável por abrir a conexão com o MongoDB
dbConnection.prototype.open = function(){

    try {
        //Somente abrimos a conexão se não existir nenhhuma conexão aberta
        if(mongoose.connection.readyState == 0)
            mongoose.connect(config.getConnectionString());

        return true;
    }
    catch(err){

        return false;
    }
}


//Método responsável por fechar a conexão com o MongoDB
dbConnection.prototype.close = function(){

    try {
        //Verificar se a conexão está aberta
        if(mongoose.connection.readyState == 1)
            mongoose.connection.close(); //Fecha a conexão

        return true;
    }
    catch(err){

        return false;
    }
}

//Exportando nosso módulo de Conexão com o MongoDB
module.exports = new dbConnection();
