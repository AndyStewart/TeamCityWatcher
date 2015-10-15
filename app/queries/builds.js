function information(id, buildInformation) {

	function convertToBuildInformation(serverBuild) {
		return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
	}

	return buildInformation(id).then(convertToBuildInformation);
}

function pipelines(getBuildSummaries, getBuildInformation) {

	function getAllBuildSummaries() {
		return getBuildSummaries()
					.then(function(response) {
						return response.build;
					});
	}

	function pipeline(builds) {
		return {
			builds: builds,
			add: function(build) {
				return pipeline([build].concat(builds));
			},
			last: function() {
				return builds[builds.length-1];
			}
		}
	}

	function buildScreen(pipelines) {
		return {
			pipelines: pipelines,
			add: function(pipeline) {
				return buildScreen(pipelines.concat(pipeline));
			}
		};
	}

	function getDependent(build) {
		return build["snapshot-dependencies"].build[0].id;
	}

	function addBuildToPipeline(pipeline, buildId) {
		return getBuildInformation(buildId)
				.then(pipeline.add)
				.then(function(newPipeline) {
					var lastBuild = newPipeline.last();
					if (lastBuild["snapshot-dependencies"] && lastBuild["snapshot-dependencies"].build.length > 0)
						return addBuildToPipeline(newPipeline, getDependent(lastBuild))
					return newPipeline;
				});

	}

	function loadPipeline(build) {
		return addBuildToPipeline(pipeline([]), build.id)
				.then(function(pipeline) {
					return pipeline.builds;
				});
	}

	function builds(screen) {
		return function(build) {
			return loadPipeline(build).then(screen.add)
		}
	}

	var screen = buildScreen([]);
	return getAllBuildSummaries()
				.then(builds(screen))
				.then(function(screen) {
					console.log(screen.pipelines);
					return screen.pipelines;
				});
}

module.exports = { information: information, pipelines: pipelines }