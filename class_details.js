
var methods = {};
var mysql = require('mysql'); // MS Sql Server client

function classDetails(request, connection, classIDDetails, callback){
	var classQueryResult = function classQueryResult(err, result){
		if(result){
			callback (null, result);
		}
		else{
			callback (null, false);
		}
	}
  	getClassDetails(request, connection, classIDDetails, classQueryResult);
}

function getClassDetails(request, connection, classIDDetails, callback){
	sql = "select * from " + classIDDetails + ";" ;
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(result.length == 0){
			callback(null, false);
		}
		else{
			callback(null, result);
		}
	});
}

function allClasses(request, connection, callback){
	var classQueryResult = function classQueryResult(err, result){
		if(result){
			callback (null, result);
		}
		else{
			callback (null, false);
		}
	}
  	getAllClass(request, connection, classQueryResult);
}

function getAllClass(request, connection, callback){
	sql = "select * from classes";
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(result.length == 0){
			callback(null, false);
		}
		else{
			callback(null, result);
		}
	});
}

module.exports = {
	classDetails: classDetails,
	allClasses: allClasses
  };
