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
		var branchName = 'Unknown';
		var startDate = 'Unknown';
		var finishDate = 'Unknown';
		if (builds.length > 0) {
			branchName = builds[0].branchName;
			startDate = builds[0].startDate;
			finishDate = builds[0].finishDate;
		}
		return {
			branchName: branchName,
			startDate: startDate,
			finishDate: finishDate,
			builds: builds,
			insertAtFront: build => pipeline([build].concat(builds)),
			first: () =>  builds[0],
			contains: id =>  builds.some(b => b.id == id)
		}
	}

	function buildScreen(pipelines) {
		return {
			pipelines: pipelines,
			add: pipeline => buildScreen(pipelines.concat(pipeline)),
			contains: id => pipelines.some(p => p.contains(id))
		};
	}

	function getDependent(build) {
		return build["snapshot-dependencies"].build[0].id;
	}

	function addBuildToPipeline(pipeline, buildId) {
		return getBuildInformation(buildId)
				.then(pipeline.insertAtFront)
				.then(newPipeline => {
					var lastBuild = newPipeline.first();
					if (lastBuild["snapshot-dependencies"] && lastBuild["snapshot-dependencies"].build.length > 0)
						return addBuildToPipeline(newPipeline, getDependent(lastBuild))
					return newPipeline;
				});
	}

	function addPipelineToScreen(screen, builds) {
		if (builds.length == 0 || screen.pipelines.length == 5) {
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
		return builds => addPipelineToScreen(screen, builds);
	}

	function convertScreenToResponse(screen) {
		return screen.pipelines;
	}

	var emptyScreen = buildScreen([]);
	return getAllBuildSummaries()
				.then(addBuildsToScreen(emptyScreen))
				.then(convertScreenToResponse);
}

module.exports = { information: information, pipelines: pipelines }