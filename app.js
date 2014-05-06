
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var teamCity = require("./lib/infrastructure/teamcity");
var buildRepository = require("./lib/infrastructure/buildRepository");
var pipelineRepository = require("./lib/infrastructure/pipelineRepository");
var buildMonitor = require("./lib/application/buildmonitor");


app.get('/', function(req, res) {
	res.render('index'); 
});

app.get('/project/:projectName', function(req, res){
	res.send({ projectName: req.params.projectName });
})

app.get('/project/:projectName/pipelines', function(req, res) {
	res.send({ projectName: req.params.projectName });
});

app.get('/project/:projectName/build/:id', function(req, res) {
	buildRepository.getById(req.params.id, function(error, build){
		if (build.result === 'FAILURE' || build.result === 'SUCCESS') {
			res.set('Cache-Control', 'public, max-age=31536000');
		}
		res.send(build);
	});
})

app.get('/project/:projectName/changes/:id', function(req, res) {
	buildRepository.getChangesInBuild(req.params.id, function(error, changes){
		//res.set('Cache-Control', 'public, max-age=31536000');
		res.send(build);
	});
})

app.get('/buildstatus/:projectName', function(req, res) {
	buildMonitor.getPipelines(buildRepository, pipelineRepository, req.params.projectName , function(err, result) {
		res.send(result);
	});
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
