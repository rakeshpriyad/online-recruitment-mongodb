

var pageSize = 3,
	pageCount = 10/2,
	currentPage = 1	;
	
function getScheduleProvider(){
	var mongoServer = 'localhost';
	var mongoPort = 27017;
	var ScheduleProvider = require('./daos/scheduleProviderDao').ScheduleProvider;
	var scheduleProvider = new ScheduleProvider(mongoServer, mongoPort);
	return scheduleProvider;
}

var scheduleProvider =  getScheduleProvider();
/*
 * GET schedules listing.
 */
exports.list = function(req, res){
	var currentPage = req.params.page;
		  if ( typeof currentPage == 'undefined' )  {
				currentPage =1;
			}
	var totalSchedules=0;
	
	
	scheduleProvider.fetchTotalSchedules(function(error, schedules) {
		totalSchedules = schedules.length;
	});
	scheduleProvider.fetchAllSchedules(currentPage,function(error, schedules) {
			//res.render('schedules',{page_title:"Schedules ",data:schedules});
			 
			pageCount = Math.floor((totalSchedules/pageSize));
					
			res.render('schedules',{page_title:"Schedule Information ",data:schedules,pageSize : pageSize, totalSchedules : totalSchedules,pageCount: pageCount,currentPage: currentPage});
	});
};



exports.get = function(req, res){
		scheduleProvider.fetchScheduleById(req.params.id, function(error, schedule) {
			if (schedule == null) {
				res.send(error, 404);
			} else {
				res.send(schedule);
			}
		});
	};
exports.find = function(req, res){
		var input = JSON.parse(JSON.stringify(req.body));
		
		console.log(req.body);
		console.log(req.params.page);
		var search_param = input.schedule_name;
		var currentPage = req.params.page;
		if ( typeof currentPage == 'undefined' )  {
			currentPage =1;
		}
		if(req.params.schedule_name){
				search_param = req.params.schedule_name;
		}
		scheduleProvider.fetchTotalSchedules(function(error, schedules) {
			totalSchedules = schedules.length;
		});
			scheduleProvider.fetchScheduleByName(search_param,currentPage, function(error, schedules) {
				if (schedules == null) {
					res.send(error, 404);
				} else {
					//res.send(schedules);
					var totalSchedules = schedules.length;
					pageCount = parseInt(totalSchedules)/parseInt(pageSize);
					res.render('schedules',{page_title:"Company Information",data:schedules,shed_name:search_param,pageSize: pageSize,	totalSchedules: totalSchedules,pageCount: pageCount,currentPage: currentPage});
				}
			});

};

exports.add = function(req, res){
  res.render('add_schedule',{page_title:"Add Schedules "});
};

exports.edit = function(req, res){

    var id = req.params.id;
	scheduleProvider.fetchScheduleById(req.params.id, function(error, schedule) {
				res.render('edit_schedule',{page_title:"Edit Schedules ",schedule});
		});
};

/*Save the schedule*/
exports.save = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
		console.log('posting schedule');
		console.log(req.body);
		scheduleProvider.insertSchedule(req.body, function(error, schedule) {
			if (error) {
				res.send(error, 500);
			} else {
				res.redirect('/schedules');
			}
		});
};

exports.save_edit = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
		var id = req.params.id;
		var schedules = {
            _id     		 : id,
            schedule_name    : input.schedule_name,
            address 		 : input.address,
            schedule_name     : input.schedule_name,
            candidate_name   : input.candidate_name,
			contact_person   : input.contact_person

        };
		console.log("Update Updating : %s ",id);
		console.log("Update Updating : %s ",input.schedule_name);

			scheduleProvider.updateSchedule(schedules, function(error, cs) {
				console.log("Error Updating : %s ",req.body );
				if (error)
					console.log("Error Updating : %s ",err );

				res.redirect('/schedules');

			});

};


exports.delete_schedule = function(req,res){

     var id = req.params.id;

	scheduleProvider.deleteSchedule(req.params.id, function(error, schedules) {
			if (error) {
				res.send(error, 404);
			} else {
				res.redirect('/schedules');
			}
		});

};
