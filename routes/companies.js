

var pageSize = 2,
	pageCount = 10/2,
	currentPage = 1	;

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
	var currentPage = req.params.page;
		  if ( typeof currentPage == 'undefined' )  {
				currentPage =1;
			}

			var totalCompanies = 0;
	companyProvider.fetchTotalCompanies(function(error, companies) {
		totalCompanies = companies.length;
    });
	companyProvider.fetchAllCompanies(currentPage,function(error, companies) {
			//res.render('companies',{page_title:"Companies ",data:companies});
			
			pageCount = Math.floor(totalCompanies/pageSize);
			res.render('companies',{page_title:"Company Information ",data:companies,pageSize: pageSize,	totalCompanies: totalCompanies,pageCount: pageCount,currentPage: currentPage});
	});
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
exports.find = function(req, res){
		var input = JSON.parse(JSON.stringify(req.body));
		
		console.log(req.body);
		console.log(req.params.page);
		var search_param = input.company_name;
		var currentPage = req.params.page;
		if ( typeof currentPage == 'undefined' )  {
			currentPage =1;
		}
		if(req.params.company_name){
				search_param = req.params.company_name;
		}
			companyProvider.fetchCompanyByName(search_param,currentPage, function(error, companies) {
				if (companies == null) {
					res.send(error, 404);
				} else {
					//res.send(companies);
					var totalCompanies = 0;
					companyProvider.fetchTotalCompanies(function(error, companies) {
						totalCompanies = companies.length;
					});
					 totalCompanies = companies.length;
					pageCount = Math.floor(totalCompanies/pageSize);
					res.render('companies',{page_title:"Company Information",data:companies,comp_name:search_param,pageSize: pageSize,	totalCompanies: totalCompanies,pageCount: pageCount,currentPage: currentPage});
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
