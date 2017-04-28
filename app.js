
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//load companies route
var companies = require('./routes/companies');
var candidates = require('./routes/candidates');
var schedules = require('./routes/schedules');
const fs = require('fs');
var app = express();


// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}




/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request
-------------------------------------------*/





app.get('/', routes.index);

app.get('/companies/get/:id', companies.get);
app.get('/companies/:page', companies.list);
app.get('/companies', companies.list);
app.post('/companies/find', companies.find);
app.get('/companies/find/:page/:company_name', companies.find);


app.get('/companies/add', companies.add);
app.post('/companies/add', companies.save);
app.get('/companies/delete/:id', companies.delete_company);
app.get('/companies/edit/:id', companies.edit);
app.post('/companies/edit/:id',companies.save_edit);


app.get('/candidates/add', candidates.add);
app.post('/candidates/add', candidates.save);
app.get('/candidates/edit/:id', candidates.edit);
app.get('/candidates/get/:id', candidates.get);
app.get('/candidates', candidates.list);
app.get('/candidates/:page', candidates.list);
app.post('/candidates/edit/:id',candidates.save_edit);
app.get('/candidates/delete/:id', candidates.delete_candidate);
app.get('/candidates/upload', candidates.upload);
app.post('/candidates/upload', candidates.cv_upload);
//app.get('/candidates/find', candidates.find);
app.post('/candidates/find', candidates.find);
app.post('/candidates/find/', candidates.find);
app.get('/candidates/find/:page/:candidate_name', candidates.find);


app.get('/schedules/add', schedules.add);
app.post('/schedules/add', schedules.save);
app.get('/schedules/edit/:id', schedules.edit);


app.get('/schedules', schedules.list);
app.get('/schedules/:page', schedules.list);

app.post('/schedules/find', schedules.find);
app.get('/schedules/find/:page/:schedule_name', schedules.find);


app.use(app.router);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
