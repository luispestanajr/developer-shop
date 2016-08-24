var config = function() {};
var _connectionString = "mongodb://localhost/developershop";

config.prototype.getConnectionString = function(){

    return _connectionString;
}

module.exports = new config();