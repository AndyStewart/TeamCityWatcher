var async = require('async');
var User = require('./user');
var BuildStep = require('./BuildStep');
var Pipeline = require('./Pipeline');

var teamCityService;

var developBuildNumber = "ESubs_ESubs";

var locateLatestBuild = function(builds) {
	for(var i=0; i<builds.length; i++) {
		return builds[i];
	}
};

function createChanges(buildId, callback) {
	teamCityService.getChangesInBuild(buildId, function(err, results) {
		if (err) {
			return callback(err, results);
		}

		if (results.count === 0) {
			return callback(err, []);
		}

		async.map(results.change, teamCityService.getChangeInformation, callback);
	});
}

function getBuildInformation(buildStep, callback) {
	teamCityService.getBuildsForBuildType(buildStep.id, function(err, results) {
		if (err) {
			return callback(err, results);
		}

		if (results.build === undefined) {
			return callback(err, null);
		}

		async.parallel([function(callback) {
			teamCityService.getBuildInformation(buildStep.buildJobId, callback);
		},
		function(callback) {
			createChanges(buildStep.buildJobId, callback);
		}],
		function(err, results) {
			buildStep.addBuild(results[0], results[1]);
			return callback(err, buildStep);
		});
	});
}

var getBuildsConfigurationsInProject = function(projectName, callback) {
	teamCityService.getBuildConfigurations(projectName, function(err, buildConfigurations) {
		teamCityService.getBuildsForBuildType("ESubs_ESubs", function(err, builds) {
			var pipelines = [];

			var buildJobs = builds.build.slice(0,5);
			for (var i = 0; i <  buildJobs.length; i++) {
				pipelines.push(new Pipeline(buildConfigurations, buildJobs[i]));
			};

			return callback(null, pipelines);
		});
	});
};

var generateFunction = function(build) {
	return function(callback) {
			getBuildInformation(build, callback);
		};
};

var getAllBuilds = function(pipelines, callback) {
	var funcs = [];
	for (var p = 0; p < pipelines.length; p++) {
		var builds = pipelines[p].builds;
		for (var i = builds.length - 1; i >= 0; i--) {
			funcs.push(generateFunction(builds[i]));
		}
		pipelines[p].builds = builds.reverse();
	}
	async.parallel(funcs, function(err, allPopulatedBuilds) {
		callback(null, pipelines);
	});		
};
var getBuildStatus = function(callback) {
	var getBuildConfigurationsInEsubs = getBuildsConfigurationsInProject.bind(undefined, "E-Subs");
	async.waterfall([getBuildConfigurationsInEsubs, getAllBuilds], callback);
};

var buildMonitor = function(teamCity) {
	teamCityService = teamCity;
	this.getStatus = getBuildStatus;
}

module.exports = buildMonitor;