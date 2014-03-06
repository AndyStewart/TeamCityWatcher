var teamCity = require('./teamCity');
var async = require('async');

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

			var getExtraInfoFunction = teamCity.getBuildInformation.bind(null, build.id);
			getExtraBuildInfoFunctions.push(getExtraInfoFunction)
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

module.exports = {
	getAllBuilds: getAllBuilds
};