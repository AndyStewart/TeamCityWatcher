var teamCity = require('./teamCity');
var async = require('async');
var change = require('../domain/change');
var build = require('../domain/build');


function getAllBuilds(project, callback) {
	teamCity.getBuildsForProject(project, function(err, builds) {		
		var actualBuilds = [];
		var getExtraBuildInfoFunctions = [];
		for (var i = 0; i < builds.build.length; i++) {
			var build = builds.build[i];
			actualBuilds.push({
				id: build.id,
				result: build.status,
				number: build.number,
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

function getExtraInfoFunction(buildId, callback) {
	teamCity.getBuildInformation(buildId, function(err, buildInfo) {
		return callback(null, buildInfo);
	});
};

function getChangesInBuild(buildId, callback) {
	if (buildId === undefined) {
		console.log("No BuildId Specified");
		return callback("No BuildId Specified", []);
	}
	teamCity.getChangesInBuild(buildId, function(err, changes) {
		if (!changes || !changes.change) {
			return;
		}
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

function getById(buildId, callback) {
	if (buildId === undefined) {
		return callback("No build id specified");
	}
	console.log("Getting build " + buildId);
	getExtraInfoFunction(buildId, function(err, result) {
		console.log(result);
		var newBuild = build.create(result);
		callback(err, newBuild);
	});
}

module.exports = {
	getById: getById,
	getAllBuilds: getAllBuilds,
	getChangesInBuild: getChangesInBuild
};