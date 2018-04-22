
var methods = {};
var mysql = require('mysql'); // MS Sql Server client

methods.isProf = function (request, connection, classID, callback){
	var isProfQueryResult = function isProfQueryResult(err, result){
		if(result != 0) {
			sql = "select * from classes where class_id = '" + classID +"' and prof_id = " + result + ";";
			connection.query(sql, function (err, result, fields) {
				if (err) throw err;
				if(result.length > 0)
					callback(null, true);
				else
					callback(null, false);
			});
		}
		else{
			callback (null, false);
		}
	}
	getProfId(request, connection, isProfQueryResult);
}

methods.isStud = function (request, connection, classID, callback){
	var isStudQueryResult = function isStudQueryResult(err, result){
		if(result != 0) {
			sql = "select * from " + classID +" where student_id = " + result + ";";
			connection.query(sql, function (err, result, fields) {
				if (err) throw err;
				if(result.length > 0)
					callback(null, true);
				else
					callback(null, false);
			});
		}
		else{
			callback (null, false);
		}
	}
	getStudId(request, connection, isStudQueryResult);
}


var getProfId = function(request, connection, callback){
	sql = "select * from professors where email_id = '" + request.headers.email_id +"';";
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(result.length > 0){
			callback(null, result[0].prof_id);
		}
		else{
			callback(null, 0);
		}
	});
}

var getStudId = function(request, connection, callback){
	sql = "select * from students where email_id = '" + request.headers.email_id +"';";
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(result.length > 0){
			callback(null, result[0].stud_id);
		}
		else{
			callback(null, 0);
		}
	});
}

exports.data = methods;
