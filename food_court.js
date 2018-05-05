
var methods = {};
var mysql = require('mysql'); // MS Sql Server client

function foodCourtSchedule(request, connection, foodCourtName, callback){
	var foodCourtResult = function foodCourtResult(err, result){
		if(result){
			callback (null, result);
		}
		else{
			callback (null, false);
		}
	}
  	getFoodCourtSchedule(request, connection, foodCourtName, foodCourtResult);
}

function getFoodCourtSchedule(request, connection, foodCourtName, callback){
	sql = "select * from " + foodCourtName + ";" ;
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

function foodCourtMenu(request, connection, foodCourtName, callback){
	var currentDate = new Date();
	dayOfWeek = currentDate.getDay();
	var dayString;
	switch(dayOfWeek){
		case 1:
			dayString = 'Monday';
			break;
		case 2:
			dayString = 'Tuesday';
			break;
		case 3:
			dayString = 'Wednesday';
			break;
		case 4:
			dayString = 'Thursday';
			break;
		case 5:
			dayString = 'Friday';
			break;
		case 6:
			dayString = 'Saturday';
			break;
		case 7:
			dayString = 'Sunday';
			break;
	}
	var foodCourtResult = function foodCourtResult(err, result){
		if(result){
			callback (null, result);
		}
		else{
			callback (null, false);
		}
	}
	getFoodCourtMenu(request, connection, foodCourtName, dayString, foodCourtResult);
}

function getFoodCourtMenu(request, connection, foodCourtName, dayString, callback){
	sql = "select station,menu from " + foodCourtName + " where day_string='" + dayString + "';" ;
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
	foodCourtSchedule: foodCourtSchedule,
	foodCourtMenu: foodCourtMenu
  };
