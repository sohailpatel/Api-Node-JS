
var methods = {};
var mysql = require('mysql'); // MS Sql Server client

methods.databaseConnection = function (callback){
	var connection = mysql.createConnection({
		host: "localhost",
		user: 'root',
		password: 'root',
		database: 'university_beacon'
	});
	/*var connection = mysql.createConnection({
		host: "localhost",
		user: 'root',
		password: 'root',
		database: 'university_beacon'
	});*/
	connection.connect(function(err) {
		if (err) throw err;
		callback (null, connection);
	});
}

exports.data = methods;