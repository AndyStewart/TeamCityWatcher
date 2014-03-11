var teamCity = require('./teamCity');
var async = require('async');
var change = require('../domain/change');

function getExtraInfoFunction(buildId, callback) {
	teamCity.getBuildInformation(buildId, function(err, buildInfo) {
		getChangesInBuild(buildId, function(err, changes) {
			buildInfo.changes = changes;
			callback(null, buildInfo);
		});
	});
};

function getAllBuilds(callback) {
	teamCity.getBuildsForProject("ESubs", function(err, builds) {		
		var actualBuilds = [];
		var getExtraBuildInfoFunctions = [];
		for (var i = 0; i < builds.build.length; i++) {
			var build = builds.build[i];
			actualBuilds.push({
				id: build.id,
				result: build.status,
				buildTypeId: build.buildTypeId,
			});

			var func = getExtraInfoFunction.bind(null, build.id);
			getExtraBuildInfoFunctions.push(func)
		};
		async.parallel(getExtraBuildInfoFunctions, function(error, extraInformation) {

			for (var i = 0; i < extraInformation.length; i++) {
				var build = actualBuilds[i];
				build.status = extraInformation[i].statusText;
				build.startTime = extraInformation[i].startDate;
				build.changes = extraInformation[i].changes;
				if (extraInformation[i].running) {
					build.result = "RUNNING";
					build.percentageComplete = extraInformation[i]['running-info'].percentageComplete;
				}

				build.dependencies = [];
				for (var j = 0; j < extraInformation[i]['snapshot-dependencies'].build.length; j++) {
					var dependantBuild = extraInformation[i]['snapshot-dependencies'].build[j];
					build.dependencies.push({id: dependantBuild.id, buildTypeId: dependantBuild.buildTypeId });
				};
			}
			return callback(null, actualBuilds);
		});
	});
}

function getChangesInBuild(buildId, callback) {
	teamCity.getChangesInBuild(buildId, function(err, changes) {
		async.map(changes.change, function(change, callback) {
			teamCity.getChangeInformation(change.id, callback);
		}, function(err, results) {
			var changes = [];
			results.forEach(function(item) {
				changes.push(change.create(item.username, item.comment));
			})
			callback(null, changes);
		});
	})
}

module.exports = {
	getAllBuilds: getAllBuilds,
	getChangesInBuild: getChangesInBuild
};