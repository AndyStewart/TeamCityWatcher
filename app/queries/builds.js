function information(id, buildInformation) {

	function convertToBuildInformation(serverBuild) {
		return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
	}

	return buildInformation(id).then(convertToBuildInformation);
}

function pipelines(getBuildSummaries, getBuildInformation) {

	function cache(cacheable) {
		var results = {};
		return function(buildId) {
			if (results[buildId] !== undefined) {
				return results[buildId];
			}
			results[buildId] = cacheable(buildId);
			return results[buildId];
		};
	}

	var cachedBuildInformation = cache(getBuildInformation);

	function createEmptyPipeline() {
		return [];
	}

	function appendToPipeline(pipeline, build) {
		return pipeline.concat(build);
	}

	function findDependantBuilds(build) {
		if (build["snapshot-dependencies"] == undefined){
			return createEmptyPipeline();
		}
		var dependants = build["snapshot-dependencies"].build;	
		if (dependants.length > 0) {
			return cachedBuildInformation(dependants[0].id)
					.then(findDependantBuilds)
					.then(function(pipeline) {
						return appendToPipeline(pipeline, build);
					});
		} else {
			return appendToPipeline(createEmptyPipeline(), build);
		}
	}

	function createNextPipeline(topBuild) {
		return cachedBuildInformation(topBuild.id)
					.then(findDependantBuilds);
	}

	function parseSummaries(buildSummaries) {
		return buildSummaries.build;
	}

	function first5(pipelines) {
		var snapShot= pipelines.slice(0, 5);
		 // console.log(snapShot);
		return snapShot;		
	}

	return getBuildSummaries()
				.then(parseSummaries)
				.map(createNextPipeline)
				.then(first5);
}

module.exports = { information: information, pipelines: pipelines }