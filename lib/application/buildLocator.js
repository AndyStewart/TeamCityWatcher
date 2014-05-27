var async = require('async');

function locate(buildRepository, buildId, projectName, buildType, callback) {
	function getBuildInfo(build, callback) {
		if (buildId == build.id) {
			return callback(true);
		}

		buildRepository.getById(build.id, function(err, buildInfo) {

			function isDependencyOfBuild(dependency) {
				return (dependency.id == buildId)
			}

			if (buildInfo.dependencies.some(isDependencyOfBuild)) {
				return callback(true);
			}

			if (buildInfo.dependencies.length === 0) {
				return callback(false);
			}

			buildInfo.dependencies.forEach(function(dependency) { 
				getBuildInfo(dependency, callback);
			});
		});
	}

	buildRepository.getBuildsByType(buildType, function(err, builds) {
		builds = builds.filter(function(build) {
			return build.id >= buildId;
		})

		async.detectSeries(builds, getBuildInfo, function(build) {
			callback(null, build);
		});
	});
}

module.exports = {
	locate: locate
};