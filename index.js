var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var mysql = require('mysql'); // MS Sql Server client
var databaseConnectionNameFile = require("./database_connection.js");
var classNameFile = require("./class_sql.js");
var roleByIdFile = require("./role_by_id.js");
var connection;
var classDetails = new Map();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function databaseConnectionResult(err, getConnection){
	connection = getConnection;
}
databaseConnectionNameFile.data.databaseConnection(databaseConnectionResult);

app.get('/class_name', function(request, response) {
	function classNameResult(err, getClassDetails){
		classDetails = getClassDetails;
		console.log(classDetails.get(classNameFile.CLASS_ID) + " class_name");
		var class_details = {
			class_name : classDetails.get(classNameFile.CLASS_ID),
			department_id : classDetails.get(classNameFile.DEPARTMENT_ID)
		}
		response.send(class_details);
	}
	classNameFile.data.className(request, connection, classNameResult);
});

app.get('/is_prof', function(request, response) {
	function isProfResult(err, isProf){
		console.log(isProf + " is Prof");
		response.send(isProf);
	}
	roleByIdFile.data.isProf(request, connection, classDetails.get(classNameFile.CLASS_ID), isProfResult);
});

app.get('/is_stud', function(request, response) {
	function isStudResult(err, isStud){
		console.log(isStud + " is Stud");
		response.send(isStud);
	}
	roleByIdFile.data.isStud(request, connection, classDetails.get(classNameFile.CLASS_ID_STUDENT), isStudResult);
});

app.get('/class_started', function(request, response) {
	function classAttendanceResult(err, markAttendance){
		console.log(markAttendance + " class_started");
		response.send(markAttendance);
	}
	classNameFile.data.classStarted(request, connection, 1, classDetails.get(classNameFile.CLASS_ID), classAttendanceResult);
});

app.get('/markAttendance', function(request, response) {
	function markAttendanceResult(err, markAttendance){
		console.log(markAttendance + " markAttendance");
		response.send(markAttendance);
	}
	classNameFile.data.markStudentAttendance(request, connection, 1, classDetails.get(classNameFile.CLASS_ID_STUDENT), markAttendanceResult);
});