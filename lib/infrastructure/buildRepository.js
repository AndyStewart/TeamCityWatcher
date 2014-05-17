var teamCity = require('./teamCity');
var async = require('async');

var build = require('../domain/build');


function getAllBuilds(project, callback) {
	teamCity.getBuildsForProject(project, function(err, builds) {		
		var actualBuilds = [];
		var getExtraBuildInfoFunctions = [];
		for (var i = 0; i < builds.build.length; i++) {
			var build = builds.build[i];
			actualBuilds.push({
				id: build.id,
				name: build.name,
				buildTypeId: build.buildTypeId
			});

			var func = teamCity.getBuildInformation.bind(null, build.id);
			getExtraBuildInfoFunctions.push(func)
		};
		async.parallel(getExtraBuildInfoFunctions, function(error, extraInformation) {

			for (var i = 0; i < extraInformation.length; i++) {
				var build = actualBuilds[i];
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

function getById(buildId, callback) {
	if (buildId === undefined) {
		return callback("No build id specified");
	}
	
	teamCity.getBuildInformation(buildId, function(err, result) {
		var newBuild = build.create(result);
		callback(err, newBuild);
	});
}

module.exports = {
	getById: getById,
	getAllBuilds: getAllBuilds
};