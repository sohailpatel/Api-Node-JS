var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var mysql = require('mysql'); // MS Sql Server client
var databaseConnectionNameFile = require("./database_connection.js");
var classNameFile = require("./class_sql.js");
var roleByIdFile = require("./role_by_id.js");
var connection, profId, studId;
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

app.get('/className', function(request, response) {
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

app.get('/isProf', function(request, response) {
	function isProfResult(err, isProf){
		console.log(isProf + " is Prof");
		response.send(isProf);
	}
	roleByIdFile.data.isProf(request, connection, classDetails.get(classNameFile.CLASS_ID), isProfResult);
});

app.get('/isStud', function(request, response) {
	function isStudResult(err, isStud){
		console.log(isStud + " is Stud");
		response.send(isStud);
	}
	roleByIdFile.data.isStud(request, connection, classDetails.get(classNameFile.CLASS_ID_STUDENT), isStudResult);
});

app.get('/classStarted', function(request, response) {
	var isProfQueryResult = function isProfQueryResult(err, result){
		if(result != 0) {
			function classAttendanceResult(err, markAttendance){
				console.log(markAttendance + " class_started");
				response.send(markAttendance);
			}
			classNameFile.data.classStarted(request, connection, result, classDetails.get(classNameFile.CLASS_ID), classAttendanceResult);
		}
		else{
			response.send(false);
		}
	}
	roleByIdFile.data.getProfId(request, connection, isProfQueryResult);
	
});

app.get('/markAttendance', function(request, response) {
	var markStudentAttendanceQuery = function markStudentAttendanceQuery(err, result){
		if(result != 0) {
			function markAttendanceResult(err, markAttendance){
				console.log(markAttendance + " markAttendance");
				response.send(markAttendance);
			}
			classNameFile.data.markStudentAttendance(request, connection, result, classDetails.get(classNameFile.CLASS_ID_STUDENT), markAttendanceResult);
		}
		else{
			response.send(false);
		}
	}
	roleByIdFile.data.getStudId(request, connection, markStudentAttendanceQuery);
});

app.get('/getStudents', function(request, response) {
	function getAllStudents(err, studentDetails){
		console.log(studentDetails + " markAttendance");
		response.send(studentDetails);
	}
	roleByIdFile.data.allStudents(request, connection, getAllStudents);
});

app.get('/getProf', function(request, response) {
	function getAllProf(err, profDetails){
		console.log(profDetails + " markAttendance");
		response.send(profDetails);
	}
	roleByIdFile.data.allProfs(request, connection, getAllProf);
});