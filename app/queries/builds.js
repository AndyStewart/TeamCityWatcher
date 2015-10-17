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
		return { builds: builds }
	}

	function buildScreen(pipelines) {
		return { pipelines: pipelines };
	}

	function addToScreen(screen) {
		return pipeline => buildScreen(screen.pipelines.concat(pipeline));
	}

	function screenContainsBuild(screen, id) {
		return screen.pipelines.some(p => pipelineContainsBuild(p, id));
	}

	function pipelineContainsBuild(pipeline, id) {
		return pipeline.builds.some(b => b.id == id)
	}

	function getSnapshotDependency(build) {
		return build["snapshot-dependencies"];
	}

	function first(collection) {
		return collection[0];
	}

	function loadDependentBuild(newPipeline) {
		var dependency = getSnapshotDependency(first(newPipeline.builds));
		if (dependency && dependency.build.length > 0)
			return addBuildToPipeline(newPipeline, first(dependency.build).id)
		return newPipeline;
	}

	function addBuildToPipeline(pipeline1, buildId) {
		return getBuildInformation(buildId)
				.then(build => pipeline([build].concat(pipeline1.builds)))
				.then(loadDependentBuild);
	}

	function isEmpty(collection) {
		return collection.length == 0;
	}

	function screenIsFull(screen) {
		return screen.pipelines.length == 5;
	}

	function addPipelineToScreen(screen, builds) {
		if (isEmpty(builds) || screenIsFull(screen)) {
			return screen;
		}

		var buildToAdd = builds[0].id;
		if (screenContainsBuild(screen, buildToAdd))
			return addPipelineToScreen(screen, builds.slice(1));

		return addBuildToPipeline(pipeline([]), buildToAdd)
					.then(addToScreen(screen))
					.then(function(newScreen) {
							if (builds.length > 1) {
								return addPipelineToScreen(newScreen, builds.slice(1));
							}
							return newScreen;
						});
	}

	function addBuildsToScreen(screen) {
		return builds => addPipelineToScreen(screen, builds);
	}

	var emptyScreen = buildScreen([]);
	return getAllBuildSummaries()
				.then(addBuildsToScreen(emptyScreen))
				.then(screen => screen.pipelines.map(q => q.builds));
}

module.exports = { information: information, pipelines: pipelines }