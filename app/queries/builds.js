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
			insertAtFront: function(build) {
				return pipeline([build].concat(builds));
			},
			first: function() {
				return builds[0];
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
				.then(pipeline.insertAtFront)
				.then(function(newPipeline) {
					var lastBuild = newPipeline.first();
					if (lastBuild["snapshot-dependencies"] && lastBuild["snapshot-dependencies"].build.length > 0)
						return addBuildToPipeline(newPipeline, getDependent(lastBuild))
					return newPipeline;
				});
	}

	function loadPipeline(builds) {
		return addBuildToPipeline(pipeline([]), builds[0].id);
	}

	function builds(screen) {
		return function(builds) {
			return loadPipeline(builds).then(screen.add)
		}
	}

	var screen = buildScreen([]);
	return getAllBuildSummaries()
				.then(builds(screen))
				.then(function(screen) {
					var builds = screen.pipelines.map(q => q.builds);
					return builds;
				});
}

module.exports = { information: information, pipelines: pipelines }