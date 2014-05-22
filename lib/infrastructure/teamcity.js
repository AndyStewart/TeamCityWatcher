var http = require('http');
var request = require('request');

exports.getBuildsForBuildType = function(id, callback) {
	var requestOptions = optionBuilder("/guestAuth/app/rest/builds/?count=30&locator=buildType:" + id + ",running:any");
	request(requestOptions, function(error, response, body) {
		return callback(error, body);
	});
};

exports.getBuildsForProject = function(project, callback) {
	var requestOptions = optionBuilder("/guestAuth/app/rest/builds/?count=30&locator=project:" + project + ",running:any");
	request(requestOptions, function(error, response, body) {
		return callback(error, body);
	});
};

exports.getBuildConfigurations = function(projectName, callback) {
	var requestOptions = optionBuilder("/guestAuth/app/rest/projects/name:" + projectName);
	request(requestOptions, function(error, response, body) {
		return callback(error, body);
	});
};

exports.getBuildInformation = function(id, callback) {
	var requestOptions = optionBuilder("/guestAuth/app/rest/builds/id:" + id);
	request(requestOptions, function(error, response, body) {
		return callback(error, body);
	});
};

exports.getChangesInBuild = function(id, callback) {
	var requestOptions = optionBuilder("/guestAuth/app/rest/changes?build=id:" + id);
	request(requestOptions, function(error, response, body) {
		return callback(error, body);
	});
};

exports.getChangeInformation = function(changeId, callback) {
	var requestOptions = optionBuilder("/guestAuth/app/rest/changes/id:" + changeId);
	request(requestOptions, function(error, response, body) {
		return callback(error, body);
	});
};

exports.getBuildType = function(buildTypeId, callback) {
	var requestOptions = optionBuilder("/guestAuth/app/rest/buildTypes/id:" + buildTypeId);
	request(requestOptions, function(error, response, body) {
		return callback(error, body);
	});
};

var optionBuilder = function(url) {
	//var host = 'irislegal-build';
	var host = "172.26.53.120"
	var options = {
		json: true,
		url: "http://" + host + url,
	};
	return options;
};

var buildUrl = function(url) {
	return "http://" + host + url;
};