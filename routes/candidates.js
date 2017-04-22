


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
				//res.render('companies',{page_title:"Companies ",data:candiates,candidates_data:candiates});
				res.send(candiates);
			
			});
		/*candidateProvider.fetchAllCompanies(function(error, companies) {
			
			candidateProvider.fetchAllCandidates(function(error, candiates) {
				res.render('companies',{page_title:"Companies ",data:companies,candidates_data:candiates});
			
			});
	});
	*/

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
				res.redirect('/companies');
			}
		});
};

exports.save_edit = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
		var id = req.params.id;
		var candidates = {
            _id     : id,
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone

        };
    console.log("Update Updating : %s ",id);
		console.log("Update Updating : %s ",input.name);

			candidateProvider.updateCandidate(candidates, function(error, cs) {
				console.log("Error Updating : %s ",req.body );
				if (error)
					console.log("Error Updating : %s ",err );

				res.redirect('/companies');

			});

};


exports.delete_candidate = function(req,res){

     var id = req.params.id;

	candidateProvider.deleteCandidate(req.params.id, function(error, candidates) {
			if (error) {
				res.send(error, 404);
			} else {
				res.redirect('/companies');
			}
		});

};
