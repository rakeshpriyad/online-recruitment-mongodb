

const expressFileUpload = require('express-fileupload');
var fileUpload = expressFileUpload();

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
		candidateProvider.fetchAllCandidates(function(error, candiates) {
			res.render('candidates',{page_title:"candidates ",candidates_data:candiates});
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
    console.log("Update Updating : %s ",id);
		console.log("Update Updating : %s ",input.candidate_name);

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
	console.log(req.files);
  if (!req.files)
  
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.sampleFile;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv('G:/node-js/online-recruitment/req-img/test.png', function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
};

