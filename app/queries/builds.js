function information(id, buildInformation) {

	function convertToBuildInformation(serverBuild) {
		return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
	}

	return buildInformation(id).then(convertToBuildInformation);
}

function pipelines(getBuildSummaries, getBuildInformation) {
	function convertToBuilds(buildSummary) {
		return getBuildInformation(buildSummary.id);
	}

	function convertToPipelines(latestBuilds) {
		return latestBuilds.build.map(convertToBuilds).slice(0, 5);
	}

	return getBuildSummaries().then(convertToPipelines);	
}

module.exports = { information: information, pipelines: pipelines }