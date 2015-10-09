function information(id, buildInformation) {

	function convertToBuildInformation(serverBuild) {
		return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
	}

	return buildInformation(id).then(convertToBuildInformation);
}

function pipelines(getBuildSummaries) {
	function convertToPipeline(buildSummary) {
		return [{ status: buildSummary.status, id: buildSummary.id}];
	}

	function convertToPipelines(latestBuilds) {
		return latestBuilds.build.slice(0,5).map(convertToPipeline);
	}

	return getBuildSummaries().then(convertToPipelines);	
}

module.exports = { information: information, pipelines: pipelines }