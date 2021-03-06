

//const expressFileUpload = require('express-fileupload');
//var fileUpload = expressFileUpload();
var formidable = require('formidable');
var pageSize = 2,
	pageCount = 10/2,
	currentPage = 1	;

function getCandidateProvider(){
	var mongoServer = 'localhost';
	var mongoPort = 27017;
	var CandidateProvider = require('./daos/candidateProviderDao').CandidateProvider;
	var candidateProvider = new CandidateProvider(mongoServer, mongoPort);
	return candidateProvider;
}

var candidateProvider =  getCandidateProvider();
/*
 * GET candidates listing.
 */
exports.list = function(req, res){
		var currentPage = req.params.page;
		  if ( typeof currentPage == 'undefined' )  {
				currentPage =1;
			}
		candidateProvider.fetchAllCandidates(currentPage, function(error, candiates) {
			var totalCandidates = candiates.length;
			pageCount = totalCandidates/pageSize;
			res.render('candidates',{page_title:"Candidate Information ",candidates_data:candiates,pageSize: pageSize,	totalCandidates: totalCandidates,pageCount: pageCount,currentPage: currentPage});
       		//res.send(candiates);

			});
};


exports.get = function(req, res){
		candidateProvider.fetchCandidateById(req.params.id, function(error, candidate) {
			if (candidate == null) {
				res.send(error, 404);
			} else {
				res.send(candidate);
			}
		});
	};

exports.find = function(req, res){
		var input = JSON.parse(JSON.stringify(req.body));
		
		console.log(req.body);
		console.log(req.params.page);
		var search_param = input.candidate_name;
		var currentPage = req.params.page;
		if ( typeof currentPage == 'undefined' )  {
			currentPage =1;
		}
		if(req.params.candidate_name){
				search_param = req.params.candidate_name;
		}
			candidateProvider.fetchCandidateByName(search_param,currentPage, function(error, candiates) {
				if (candiates == null) {
					res.send(error, 404);
				} else {
					//res.send(candidates);
					var totalCandidates = candiates.length;
					pageCount = totalCandidates/pageSize;
					res.render('candidates',{page_title:"Candidate Information",candidates_data:candiates,cand_name:search_param,pageSize: pageSize,	totalCandidates: totalCandidates,pageCount: pageCount,currentPage: currentPage});
				}
			});

		};

exports.add = function(req, res){
  res.render('add_candidate',{page_title:"Add Candidates "});
};

exports.edit = function(req, res){

    var id = req.params.id;
	candidateProvider.fetchCandidateById(req.params.id, function(error, candidate) {
				res.render('edit_candidate',{page_title:"Edit Candidates ",candidate});
		});
};

/*Save the candidate*/
exports.save = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
		console.log('posting candidate');
		console.log(req.body);
		candidateProvider.insertCandidate(req.body, function(error, candidate) {
			if (error) {
				res.send(error, 500);
			} else {
				res.redirect('/candidates');
			}
		});
};

exports.save_edit = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
		var id = req.params.id;
		var candidates = {
            _id     		  : id,
            candidate_name    : input.candidate_name,
            address 		  : input.address,
            email   		  : input.email,
            phone   		  : input.phone

        };
    console.log("Update : %s ",id);
	console.log("Update  : %s ",input.candidate_name);

			candidateProvider.updateCandidate(candidates, function(error, cs) {
				console.log("Error Updating : %s ",req.body );
				if (error)
					console.log("Error Updating : %s ",err );

				res.redirect('/candidates');

			});

};


exports.delete_candidate = function(req,res){

     var id = req.params.id;

	candidateProvider.deleteCandidate(req.params.id, function(error, candidates) {
			if (error) {
				res.send(error, 404);
			} else {
				res.redirect('/candidates');
			}
		});

};

exports.upload = function(req, res){
  res.render('upload_cv',{page_title:"Upload CV "});
};


exports.cv_upload = function(req, res){
 var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });


    //res.sendfile('./public/upload_cv.html');
	//res.status(200).redirect('/candidates',{code: 'success', message:'Valid'});
	//res.status(200).send({code: 'success', message:'Uploaded'});
	res.render('upload_cv',{page_title:"Candidates File Upload ",message:'Uploaded'});
};
