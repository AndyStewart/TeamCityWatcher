function information(id, buildInformation) {

	function convertToBuildInformation(serverBuild) {
		return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
	}

	return buildInformation(id).then(convertToBuildInformation);
}

function pipelines(getBuildSummaries, getBuildInformation) {

	var getAllBuildSummaries = () => getBuildSummaries().then(r => r.build);

	function pipeline(builds) {
		return { builds: builds }
	}

	function buildScreen(pipelines) {
		return { pipelines: pipelines };
	}

	function addToScreen(screen) {
		return pipeline => buildScreen(screen.pipelines.concat(pipeline));
	}

	var screenContainsBuild = (screen, id) => screen.pipelines.some(p => pipelineContainsBuild(p, id));
	var pipelineContainsBuild = (pipeline, id) => pipeline.builds.some(b => b.id == id);
	var getSnapshotDependency = build => build["snapshot-dependencies"];

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

	var first = col => col[0];
	var isEmpty = collection => collection.length == 0;
	var screenIsFull = screen => screen.pipelines.length == 5;

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

	var convertToResponse = screen => screen.pipelines.map(q => q.builds);
	var emptyScreen = buildScreen.bind(null, []);
	var addBuildsToEmptyScreen = addPipelineToScreen.bind(null, emptyScreen());

	return getAllBuildSummaries()
				.then(addBuildsToEmptyScreen)
				.then(convertToResponse);
}

module.exports = { information: information, pipelines: pipelines }