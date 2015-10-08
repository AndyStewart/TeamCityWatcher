function all(serverResults) {

	function createBuild(serverBuild) {
		return { status: serverBuild.status, id: serverBuild.id};
	}

	function convertToBuilds(serverResult) {
		return serverResult.build.map(createBuild).slice(0,5);
	}

	return serverResults().then(convertToBuilds);
}

function information(id, buildInformation) {

	function convertToBuildInformation(serverBuild) {
		return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
	}

	return buildInformation(id).then(convertToBuildInformation);
}

module.exports = { all: all, information: information }