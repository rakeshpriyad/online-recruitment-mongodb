var schedulesTable = 'schedules';

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

ScheduleProvider = function(host, port) {

	this.db = new Db('schedules', new Server(host, port));
	this.db.open(function(){});

	this.fetchAllSchedules = function(cb) {
		this.db.collection(schedulesTable, function(error, schedules) {
			if (error) {
				cb(error, null);
			} else {
				schedules.find().toArray(function(error, results) {
					cb(error, results);
				});
			}
		});
	};

	this.fetchScheduleById = function(id, cb) {
		this.db.collection(schedulesTable, function(error, schedules) {
			if (error) {
				cb(error, null);
			} else {
				schedules.findOne({
					_id:schedules.db.bson_serializer.ObjectID.createFromHexString(id)
				}, function(error, result) {
					cb(error, result);
				});
			}
		});
	};

	this.insertSchedule = function(schedule, cb) {
		console.log('inserting schedule: ' + schedule);
		this.db.collection(schedulesTable, function(error, schedules) {
			if (error) {
				cb(error, null);
			} else {
				schedules.insert([schedule], function() {
					cb(null, schedule);
				});
			}
		});
	};

	this.updateSchedule = function(schedule, cb) {
		console.log('updateSchedule'+schedule._id);
		this.db.collection(schedulesTable, function(error, schedules) {
			if (error) {
				cb(error, null);
			} else {
				schedules.update({_id:schedules.db.bson_serializer.ObjectID.createFromHexString(schedule._id)},
					{schedule_name:schedule.schedule_name, address:schedule.address, company_name:schedule.company_name,candidate_name:schedule.candidate_name},
					function(error, result) {
						cb(error, result);
				});
			}
		});
	};

	this.deleteSchedule = function(id, cb) {
		this.db.collection(schedulesTable, function(error, schedules) {
			if (error) {
				cb(error, null);
			} else {
				schedules.remove({_id:schedules.db.bson_serializer.ObjectID.createFromHexString(id)},
					function(error, result) {
						cb(error, result);
				});
			}
		});
	};
};

exports.ScheduleProvider = ScheduleProvider;
