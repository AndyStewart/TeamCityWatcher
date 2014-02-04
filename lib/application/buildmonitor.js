var async = require('async');
var User = require('./user');

var teamCityService;

var developBuildNumber = "ESubs_ESubs";

var locateLatestBuild = function(builds) {
	for(var i=0; i<builds.length; i++) {
		return builds[i];
	}
};

function containsUser(changeInformation, user){
	for(var i = 0; i < changeInformation.length; i++) {
		var change= changeInformation[i];
		if (change.username === user)
			return true;
	}

	return false;
}

function parseChanges(changes) {
	var changeInformation = [];
	for(var i = 0; i < changes.length; i++) {
		var user = new User(changes[i]);
		// De Dupe changes
		if (containsUser(changeInformation, user.username) === false) {
			changeInformation.push(user);
		}
	}	
	return changeInformation;
}

function createBuildSummary(latestBuild, extendedBuildInformation, changes) {
	var status = latestBuild.status;

	if (latestBuild.running) {
		status = "RUNNING";
	}
	
	return {
		result: status,
		percentageComplete: latestBuild.percentageComplete,
		status: extendedBuildInformation.statusText,
		startTime: extendedBuildInformation.startDate,
		defects: findDefectsOnBuild(extendedBuildInformation),
		changes: parseChanges(changes)
	};
}

function findDefectsOnBuild(extendedBuildInformation) {
	var defects = [];
	if (extendedBuildInformation.relatedIssues !== undefined && extendedBuildInformation.relatedIssues.issueUsage !== undefined) {
		for (var i = extendedBuildInformation.relatedIssues.issueUsage.length - 1; i >= 0; i--) {
			var issue = extendedBuildInformation.relatedIssues.issueUsage[i].issue;
			defects[i] = issue.id;
		}
	}
	return defects;
}

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
			var buildSummary =  createBuildSummary(latestBuild, results[0], results[1]);
			buildSummary.name = build.name;
			return callback(err, buildSummary);
		});
	});
}

var getBuilds = function(projectName, callback) {
	var buildTypes = [];
	teamCityService.getBuildConfigurations(projectName, function(err, result) {
		for (var i = result.buildTypes.buildType.length - 1; i >= 0; i--) {
			var buildType = result.buildTypes.buildType[i];
			buildTypes.push({ 
				id: buildType.id,
				name: buildType.name,
			});
			callback(null, buildTypes);
		}
	});
};

var generateFunction = function(build) {
	return function(callback) {
			getBuildInformation(build, callback);
		};
};

var getAllBuilds = function(builds, callback) {
	var functions = [];
	for (var i = builds.length - 1; i >= 0; i--) {
		functions.push(generateFunction(builds[i]));
	};
	async.parallel(functions, callback);
};
var getBuildStatus = function(callback) {
	async.waterfall([
		function(callback) {
			getBuilds("E-Subs", callback);
		},
		function(buildTypes, callback){
			getAllBuilds(buildTypes, callback);
		}],
	function(err, results) {
		if (err) {
			return callback(err, results);
		}
		
		return callback(err, results);
	});
};

module.exports = function(teamCity) {
	teamCityService = teamCity;
	return {
			getStatus: getBuildStatus
		};
	};