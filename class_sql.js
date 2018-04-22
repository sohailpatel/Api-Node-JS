
var methods = {};
var mysql = require('mysql'); // MS Sql Server client

const CLASS_ID = "class_id",CLASS_ID_STUDENT = "class_id_stud", DEPARTMENT_ID = "department_id", CLASS_ID_DETAILS = "class_id_det", LECTURE_COUNT="lecture_count", PREV_DATE="prev_date";

methods.className = function (request, connection, callback){
	var startIndex, endIndex, dayOfWeek, totalLectureTime, startLectureTime, endLectureTime, currentTime, timeDecimalPart;
	var classDetails = new Map();
	var currentDate = new Date().getDate;
	currentDate = new Date("2018-03-19 13:20");                               //remove after testing
	dayOfWeek = currentDate.getDay() - 1;
	var classQueryResult = function classQueryResult(err, result){
		if(result){
			startIndex = dayOfWeek * 5;
			endIndex = startIndex + 5;
			var iterator = 0;
			while( iterator < result.length){
				var lectureDays = result[iterator].days;
				if(lectureDays.charAt(dayOfWeek) == '1') {
					var lectureTime = result[iterator].timings.substring(startIndex, endIndex);
					totalLectureTime = result[iterator].lec_len;
					startLectureTime = parseFloat(lectureTime.replace(":","."));
					endLectureTime = startLectureTime + (totalLectureTime / 60);
					var splitEndLectureTime = endLectureTime.toString().split(".");
					timeDecimalPart = splitEndLectureTime[1];
					if(splitEndLectureTime[1].length == 1){
						timeDecimalPart *= 10;
					}
					if(timeDecimalPart >= 60){
						endLectureTime += 1;
						endLectureTime -= timeDecimalPart / 100;
					}
					var hourFormat = currentDate.getHours();
					var minFormat = currentDate.getMinutes();
					currentTime = hourFormat + "." + minFormat;
					if(currentTime >= startLectureTime && currentTime <= endLectureTime ){
						classDetails.set(CLASS_ID, result[iterator].class_id);
						classDetails.set(CLASS_ID_STUDENT, result[iterator].class_id + "_stud");
						classDetails.set(CLASS_ID_DETAILS, result[iterator].class_id + "_det");
						classDetails.set(DEPARTMENT_ID, result[iterator].department_id);
						break;
					}
				}
				iterator++;
			}
			callback (null, classDetails);
		}
		else{
			callback (null, false);
		}
	}
  	getClassQuery(request, connection, classQueryResult);
}

methods.classStarted = function (request, connection, profID, classID, callback){
	var timeDiff, diffInDays, currentDate, diffInDays, lectureCount = 0;
	var classQueryResult = function classQueryResult(err, lectureCountDetails){
		if(lectureCountDetails){
			lectureCount = lectureCountDetails.get(LECTURE_COUNT) + 1;
			prevLecDate = lectureCountDetails.get(PREV_DATE);
			currentDate = new Date();
			prevLecDate = new Date(prevLecDate);
			diffInDays = (currentDate.getTime() - prevLecDate.getTime())/(1000*60*60*24);
			if(diffInDays >= 1) {
				var date = new Date();
				var sqlDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T01:32:21.196Z";
				var sql = "update classes set total_lec = " + lectureCount + " , prev_lec_date = '" + sqlDate + "' where class_id = '" + classID + "' ;";
				connection.query(sql, function (err, result, fields) {
					if (err) throw err;
					callback (null, true);
				});
			}
			else{
				console.log("Attendance already marked");
				callback (null, false);
			}
		}
		else{
			callback (null, false);
		}
	}
	getTotalLectures(request, connection, classID, profID, classQueryResult);
}

methods.markStudentAttendance = function (request, connection, studentID, classIDStudent, callback){
	var timeDiff, diffInDays, currentDate, diffInDays, lectureCount = 0;
	var markStudentAttendanceQuery = function classQueryResult(err, studentLecDetails){
		if(studentLecDetails){
			lectureCount = studentLecDetails.get(LECTURE_COUNT) + 1;
			prevLecDate = studentLecDetails.get(PREV_DATE);
			console.log("prevLecDate "+prevLecDate + " classIDStudent "+classIDStudent);
			currentDate = new Date();
			prevLecDate = new Date(prevLecDate);
			diffInDays = (currentDate.getTime() - prevLecDate.getTime())/(1000*60*60*24);
			console.log("currentDate "+currentDate + "prevLecDate "+prevLecDate+" diffInDays "+diffInDays);
			if(diffInDays >= 1) {
				var date = new Date();
				var sqlDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T01:32:21.196Z";
				var sql = "update " + classIDStudent + " set attendance = " + lectureCount + " , prev_lec_date = '" + sqlDate + "' where student_id = " + studentID + " ;";
				console.log(sql);
				connection.query(sql, function (err, result, fields) {
					if (err) throw err;
					callback (null, true);
				});
			}
			else{
				console.log("Attendance already marked");
				callback (null, false);
			}
		}
		else{
			callback (null, false);
		}
	}
	getStudentLecDetails(request, connection, classIDStudent, studentID, markStudentAttendanceQuery);
}

var getClassQuery = function(request, connection, callback){
	sql = "select * from classes where class_room = '" + request.headers.beacon_name + "';" ;
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

var getTotalLectures = function(request, connection, classID, profID, callback){
	var lectureCount = 0;
	var lectureCountDetails = new Map();
	sql = "select total_lec, prev_lec_date from classes where class_id = '" + classID + "' and prof_id = "+ profID +";";
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(result.length == 0){
			callback(null, false);
		}
		else{
			lectureCountDetails.set(LECTURE_COUNT, result[0].total_lec);
			lectureCountDetails.set(PREV_DATE, result[0].prev_lec_date);
			callback(null, lectureCountDetails);
		}
	});
}

var getStudentLecDetails = function(request, connection, classIDStudent, studentID, callback){
	var lectureCount = 0;
	var studentLecDetails = new Map();
	sql = "select attendance, prev_lec_date  from "+ classIDStudent +" where student_id = "+ studentID +";";
	connection.query(sql, function (err, result, fields) {
		if (err) throw err;
		if(result.length == 0){
			callback(null, false);
		}
		else{
			studentLecDetails.set(LECTURE_COUNT, result[0].attendance);
			studentLecDetails.set(PREV_DATE, result[0].prev_lec_date);
			callback(null, studentLecDetails);
		}
	});
}

module.exports.CLASS_ID = CLASS_ID;
module.exports.CLASS_ID_STUDENT = CLASS_ID_STUDENT;
module.exports.DEPARTMENT_ID = DEPARTMENT_ID;
exports.data = methods;
