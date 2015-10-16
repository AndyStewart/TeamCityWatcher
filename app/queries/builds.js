function information(id, buildInformation) {

	function convertToBuildInformation(serverBuild) {
		return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
	}

	return buildInformation(id).then(convertToBuildInformation);
}

function pipelines(getBuildSummaries, getBuildInformation) {

	function getAllBuildSummaries() {
		return getBuildSummaries().then(r => r.build);
	}

	function pipeline(builds) {
		return {
			builds: builds,
			insertAtFront: function(build) {
				return pipeline([build].concat(builds));
			},
			first: function() {
				return builds[0];
			},
			contains: function(id) {
				return builds.some(b => b.id == id);
			}
		}
	}

	function buildScreen(pipelines) {
		return {
			pipelines: pipelines,
			add: function(pipeline) {
				return buildScreen(pipelines.concat(pipeline));
			},
			contains: function(id) {
				return pipelines.some(p => p.contains(id));
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

	function addPipelineToScreen(screen, builds) {
		if (builds.length == 0) {
			return screen;
		}

		var buildToAdd = builds[0].id;
		if (screen.contains(buildToAdd))
			return addPipelineToScreen(screen, builds.slice(1));

		return addBuildToPipeline(pipeline([]), buildToAdd)
					.then(screen.add)
					.then(function(newScreen) {
							if (builds.length > 1) {
								return addPipelineToScreen(newScreen, builds.slice(1));
							}
							return newScreen;
						});
	}

	function addBuildsToScreen(screen) {
		return function(builds) {
			return addPipelineToScreen(screen, builds);
		}
	}

	function convertScreenToResponse(screen) {
		return screen.pipelines.map(q => q.builds).slice(0,5);
	}

	var emptyScreen = buildScreen([]);
	return getAllBuildSummaries()
				.then(addBuildsToScreen(emptyScreen))
				.then(convertScreenToResponse);
}

module.exports = { information: information, pipelines: pipelines }