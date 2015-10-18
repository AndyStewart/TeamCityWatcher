function information(id, buildInformation) {

	function convertToBuildInformation(serverBuild) {
		return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
	}

	return buildInformation(id).then(convertToBuildInformation);
}

function pipelines(getBuildSummaries, getBuildInformation) {

	function pipeline(builds) {
		return { builds: builds }
	}

	function buildScreen(pipelines) {
		return { pipelines: pipelines };
	}

	function compose(f, g) {
		return (x) => f(g(x));
	}

	function addBuildToPipeline(pipeline1, buildId) {

		function loadDependentBuild(newPipeline) {
			var first = col => col[0];
			var getSnapshotDependency = build => build["snapshot-dependencies"];
			var getFirstSnapshotDependency = compose(getSnapshotDependency, first);
			var dependency = getFirstSnapshotDependency(newPipeline.builds);

			

			if (dependency && dependency.build.length > 0)
			{
				return addBuildToPipeline(newPipeline, first(dependency.build).id)
			}
			return newPipeline;
		}

		return getBuildInformation(buildId)
				.then(build => pipeline([build].concat(pipeline1.builds)))
				.then(loadDependentBuild);
	}



	function addPipelineToScreen(screen, builds) {
		var screenIsFull = screen => screen.pipelines.length == 5;
		if (screenIsFull(screen)) {
			return screen;			
		}

		var isEmpty = collection => collection.length == 0;
		if (isEmpty(builds)) {
			return screen;
		}

		var buildId = builds[0].id;
		var pipelineContainsBuild = (pipeline, id) => pipeline.builds.some(b => b.id == id);
		var screenContainsBuild = (screen, id) => screen.pipelines.some(p => pipelineContainsBuild(p, id));
		if (screenContainsBuild(screen, buildId))
			return addPipelineToScreen(screen, builds.slice(1));
		
		var addToScreen = compose(buildScreen, p => screen.pipelines.concat(p));

		return addBuildToPipeline(pipeline([]), buildId)
					.then(addToScreen)
					.then(function(newScreen) {
								if (builds.length > 1) {
									return addPipelineToScreen(newScreen, builds.slice(1));
								}
								return newScreen;
							});
	}

	var convertToResponse = screen => screen.pipelines.map(q => q.builds);
	var addBuildsToEmptyScreen = addPipelineToScreen.bind(null, buildScreen([]));
	return getBuildSummaries()
				.then(r => r.build)
				.then(addBuildsToEmptyScreen)
				.then(convertToResponse);
}

module.exports = { information: information, pipelines: pipelines }