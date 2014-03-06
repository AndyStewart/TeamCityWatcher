
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
var buildMonitor = require("./lib/application/buildmonitor2");


app.get('/', function(req, res) {
	res.render('index'); 
});

app.get('/buildstatus', function(req, res) {
	buildMonitor.getPipelines(buildRepository, pipelineRepository, function(err, result) {
		res.send(result);
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
