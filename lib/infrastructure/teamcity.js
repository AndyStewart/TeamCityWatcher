var http = require('http');
var request = require('request');

exports.getBuildsForBuildType = function(id, callback) {
	//var requestOptions = optionBuilder("/guestAuth/app/rest/builds/?locator=buildType:" + id + ",branch:default:any,running:any");
	var requestOptions = optionBuilder("/guestAuth/app/rest/builds/?locator=buildType:" + id + ",running:any");
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

exports.getChangeInformation = function(change, callback) {
	var requestOptions = optionBuilder("/guestAuth/app/rest/changes/id:" + change.id);
	request(requestOptions, function(error, response, body) {
		return callback(error, body);
	});
};

var optionBuilder = function(url) {
	var host = 'irislegal-build';
	var options = {
		json: true,
		url: "http://" + host + url,
	};
	return options;
};

var buildUrl = function(url) {
	return "http://" + host + url;
};