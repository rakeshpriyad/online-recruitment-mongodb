var companiesTable = 'companies';

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

CompanyProvider = function(host, port) {

	this.db = new Db('companies', new Server(host, port));
	this.db.open(function(){});

	this.dbCandidate = new Db('candidates', new Server(host, port));
	this.dbCandidate.open(function(){});

	this.fetchAllCompanies = function(cb) {
		this.db.collection(companiesTable, function(error, companies) {
			if (error) {
				cb(error, null);
			} else {
				companies.find().toArray(function(error, results) {
					cb(error, results);
				});
			}
		});
	};

	this.fetchAllCandidates = function(cb) {
		this.dbCandidate.collection("candidates", function(error, candidates) {
			if (error) {
				cb(error, null);
			} else {
				candidates.find().toArray(function(error, results) {
					cb(error, results);
				});
			}
		});
	};

	this.fetchCompanyById = function(id, cb) {
		this.db.collection(companiesTable, function(error, companies) {
			if (error) {
				cb(error, null);
			} else {
				companies.findOne({
					_id:companies.db.bson_serializer.ObjectID.createFromHexString(id)
				}, function(error, result) {
					cb(error, result);
				});
			}
		});
	};

	this.insertCompany = function(company, cb) {
		console.log('inserting company: ' + company);
		this.db.collection(companiesTable, function(error, companies) {
			if (error) {
				cb(error, null);
			} else {
				companies.insert([company], function() {
					cb(null, company);
				});
			}
		});
	};

	this.updateCompany = function(company, cb) {
		console.log('updateCompany'+company._id);
		this.db.collection(companiesTable, function(error, companies) {
			if (error) {
				cb(error, null);
			} else {
				companies.update({_id:companies.db.bson_serializer.ObjectID.createFromHexString(company._id)},
					{company_name:company.company_name, address:company.address, email:company.email},
					function(error, result) {
						cb(error, result);
				});
			}
		});
	};

	this.deleteCompany = function(id, cb) {
		this.db.collection(companiesTable, function(error, companies) {
			if (error) {
				cb(error, null);
			} else {
				companies.remove({_id:companies.db.bson_serializer.ObjectID.createFromHexString(id)},
					function(error, result) {
						cb(error, result);
				});
			}
		});
	};
};

exports.CompanyProvider = CompanyProvider;
