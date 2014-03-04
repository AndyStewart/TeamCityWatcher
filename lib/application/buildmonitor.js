var async = require('async');
var User = require('./user');
var BuildConfiguration = require('./BuildConfiguration');

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

function getBuildInformation(build, callback) {
	teamCityService.getBuildsForBuildType(build.id, function(err, results) {
		if (err) {
			return callback(err, results);
		}

		if (results.build === undefined) {
			return callback(err, null);
		}

		var latestBuild = locateLatestBuild(results.build);
		async.parallel([function(callback) {
			teamCityService.getBuildInformation(latestBuild.id, callback);
		},
		function(callback) {
			createChanges(latestBuild.id, callback);
		}],
		function(err, results) {
			build.addBuild(latestBuild, results[0], results[1]);
			return callback(err, build);
		});
	});
}

var getBuildsConfigurationsInProject = function(projectName, callback) {
	var buildTypes = [];
	var allBuilds = [];
	teamCityService.getBuildConfigurations(projectName, function(err, result) {
		for (var i = result.buildTypes.buildType.length - 1; i >= 0; i--) {
			var buildType = result.buildTypes.buildType[i];
			buildTypes.push(new BuildConfiguration(buildType.id, buildType.name));
		}

		allBuilds.push(buildTypes);
		return callback(null, allBuilds);
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
		var builds = pipelines[p];
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