var config = function() {};
var _connectionString = "mongodb://developershop:abc123@ds147995.mlab.com:47995/developershop";

config.prototype.getConnectionString = function(){

    return _connectionString;
}

module.exports = new config();