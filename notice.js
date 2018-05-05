
var methods = {};
var mysql = require('mysql'); // MS Sql Server client

function announcement(request, connection, callback){
	var announcementResult = function announcementResult(err, result){
		if(result){
			callback (null, result);
		}
		else{
			callback (null, false);
		}
	}
	getAnnouncement(request, connection, announcementResult);
}

function getAnnouncement(request, connection, callback){
	sql = "SELECT notice FROM announcement WHERE timings >= CURDATE();";
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
	announcement: announcement
  };
