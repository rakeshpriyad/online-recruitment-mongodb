


function getCompanyProvider(){
	var mongoServer = 'localhost';
	var mongoPort = 27017;
	var CompanyProvider = require('./daos/companyProviderDao').CompanyProvider;
	var companyProvider = new CompanyProvider(mongoServer, mongoPort);
	return companyProvider;
}

var companyProvider =  getCompanyProvider();
/*
 * GET companies listing.
 */
exports.list = function(req, res){
	//var compdata;
	//var candidatedata;
	companyProvider.fetchAllCompanies(function(error, companies) {
			
			//companyProvider.fetchAllCandidates(function(error, candiates) {
			res.render('companies',{page_title:"Companies ",data:companies});
			//res.send(candiates);
			//});
	});

	
	//renderMain(res,compdata,candidatedata);

};



exports.get = function(req, res){
		companyProvider.fetchCompanyById(req.params.id, function(error, company) {
			if (company == null) {
				res.send(error, 404);
			} else {
				res.send(company);
			}
		});
	};

exports.add = function(req, res){
  res.render('add_company',{page_title:"Add Companies "});
};

exports.edit = function(req, res){

    var id = req.params.id;
	companyProvider.fetchCompanyById(req.params.id, function(error, company) {
				res.render('edit_company',{page_title:"Edit Companies ",company});
		});
};

/*Save the company*/
exports.save = function(req,res){

    var input = JSON.parse(JSON.stringify(req.body));
		console.log('posting company');
		console.log(req.body);
		companyProvider.insertCompany(req.body, function(error, company) {
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
		var companies = {
            _id     : id,
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone

        };
    console.log("Update Updating : %s ",id);
		console.log("Update Updating : %s ",input.name);

			companyProvider.updateCompany(companies, function(error, cs) {
				console.log("Error Updating : %s ",req.body );
				if (error)
					console.log("Error Updating : %s ",err );

				res.redirect('/companies');

			});

};


exports.delete_company = function(req,res){

     var id = req.params.id;

	companyProvider.deleteCompany(req.params.id, function(error, companies) {
			if (error) {
				res.send(error, 404);
			} else {
				res.redirect('/companies');
			}
		});

};
