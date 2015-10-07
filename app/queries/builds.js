
function createBuild(serverBuild) {
	return { status: serverBuild.status, id: serverBuild.id};
}

function convertToBuilds(serverResult) {
	return serverResult.build.map(createBuild);
}

function all(serverResults) {
	return serverResults().then(convertToBuilds);
}

function convertToBuildInformation(serverBuild) {
	return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
}

function information(id, buildInformation) {
	return buildInformation(id).then(convertToBuildInformation);
}

module.exports = { all: all, information: information }