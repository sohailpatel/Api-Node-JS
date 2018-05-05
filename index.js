var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var mysql = require('mysql'); // MS Sql Server client
var databaseConnectionNameFile = require("./database_connection.js");
var classNameFile = require("./class_sql.js");
var roleByIdFile = require("./role_by_id.js");
var classDetailsFile = require("./class_details.js");
var foodCourtFile = require("./food_court.js");
var noticeFile = require("./notice.js");
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
		console.log(classDetails.get(classNameFile.CLASS_ID_DETAILS) + " class_det");
		/*for (var [key, value] of classDetails) {
			console.log(key + ' = ' + value);
		}*/
		var class_details = {
			class_name : classDetails.get(classNameFile.CLASS_ID),
			department_id : classDetails.get(classNameFile.DEPARTMENT_ID)
		}
		var json = JSON.stringify(class_details);
		response.send(json);
	}
	classNameFile.className(request, connection, classNameResult);
});

app.get('/classTimings', function(request, response) {
	function classTimingResult(err, getClassTimings){
		console.log(getClassTimings + " getClassTimings");
		var object =[];
		var iterator = 0;
		for (var [key, value] of getClassTimings) {
			object[iterator] = {
				"day_string": key,
				"timings": value
			};
			iterator++;
		}
		response.send(object);
	}
	classNameFile.classTimings(request, connection, classDetails.get(classNameFile.CLASS_ID), classTimingResult);
});

app.get('/isProf', function(request, response) {
	function isProfResult(err, isProf){
		console.log(isProf + " is Prof");
		response.send(isProf);
	}
	roleByIdFile.isProf(request, connection, classDetails.get(classNameFile.CLASS_ID), isProfResult);
});

app.get('/isStud', function(request, response) {
	function isStudResult(err, isStud){
		console.log(isStud + " is Stud");
		response.send(isStud);
	}
	roleByIdFile.isStud(request, connection, classDetails.get(classNameFile.CLASS_ID_STUDENT), isStudResult);
});

app.get('/classStarted', function(request, response) {
	var isProfQueryResult = function isProfQueryResult(err, result){
		if(result != 0) {
			function classAttendanceResult(err, markAttendance){
				console.log(markAttendance + " class_started");
				response.send(markAttendance);
			}
			classNameFile.classStarted(request, connection, result, classDetails.get(classNameFile.CLASS_ID), classAttendanceResult);
		}
		else{
			response.send(false);
		}
	}
	roleByIdFile.getProfId(request, connection, isProfQueryResult);
	
});

app.get('/markAttendance', function(request, response) {
	var markStudentAttendanceQuery = function markStudentAttendanceQuery(err, result){
		if(result != 0) {
			function markAttendanceResult(err, markAttendance){
				console.log(markAttendance + " markAttendance");
				response.send(markAttendance);
			}
			classNameFile.markStudentAttendance(request, connection, result, classDetails.get(classNameFile.CLASS_ID_STUDENT), markAttendanceResult);
		}
		else{
			response.send(false);
		}
	}
	roleByIdFile.getStudId(request, connection, markStudentAttendanceQuery);
});

app.get('/getStudents', function(request, response) {
	function getAllStudents(err, studentDetails){
		console.log(studentDetails + " markAttendance");
		response.send(studentDetails);
	}
	roleByIdFile.allStudents(request, connection, getAllStudents);
});

app.get('/getProfs', function(request, response) {
	function getAllProf(err, profDetails){
		console.log(profDetails + " markAttendance");
		response.send(profDetails);
	}
	roleByIdFile.allProfs(request, connection, getAllProf);
});

app.get('/classSchedule', function(request, response) {
	var getClassSchedule = function getClassSchedule(err, classSchedule){
		console.log(classSchedule);
		response.send(classSchedule);
	}
	classDetailsFile.classDetails(request, connection, classDetails.get(classNameFile.CLASS_ID_DETAILS), getClassSchedule);	
});

app.get('/classStudents', function(request, response) {
	var getClassSchedule = function getClassSchedule(err, classSchedule){
		console.log(classSchedule);
		response.send(classSchedule);
	}
	classDetailsFile.classDetails(request, connection, classDetails.get(classNameFile.CLASS_ID_STUDENT), getClassSchedule);	
});

app.get('/getClasses', function(request, response) {
	function getAllClasses(err, classDetails){
		console.log(classDetails + " classDetails");
		response.send(classDetails);
	}
	classDetailsFile.allClasses(request, connection, getAllClasses);
});


app.get('/foodCourtSchedule', function(request, response) {
	var foodCourtName = request.headers.beacon_name + "_schedule";
	var getFoodCourtSchedule = function getFoodCourtSchedule(err, foodCourtSchedule){
		console.log(foodCourtSchedule);
		response.send(foodCourtSchedule);
	}
	foodCourtFile.foodCourtSchedule(request, connection, foodCourtName, getFoodCourtSchedule);	
});

app.get('/foodCourtMenu', function(request, response) {
	var foodCourtName = request.headers.beacon_name + "_menu";
	var getFoodCourtMenu = function getFoodCourtMenu(err, foodCourtSchedule){
		console.log(foodCourtSchedule);
		response.send(foodCourtSchedule);
	}
	foodCourtFile.foodCourtMenu(request, connection, foodCourtName, getFoodCourtMenu);	
});

app.get('/announcement', function(request, response) {
	var getAnnouncement = function getAnnouncement(err, announcementResult){
		console.log(announcementResult);
		response.send(announcementResult);
	}
	noticeFile.announcement(request, connection, getAnnouncement);	
});