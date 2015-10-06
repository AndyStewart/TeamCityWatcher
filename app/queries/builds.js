
function createBuild(serverBuild) {
	return { status: serverBuild.status, id: serverBuild.id};
}

function convertToBuilds(serverResult) {
	return serverResult.build.map(createBuild);
}

function all(serverResults, sendToClient) {
	serverResults().then(convertToBuilds).then(sendToClient);
}

function convertToBuildInformation(serverBuild) {
	return {id : serverBuild.id, status: serverBuild.status, name: serverBuild.buildType.name, statusText: serverBuild.statusText};
}

function id(id, buildInformation, sendToClient) {
	buildInformation(id).then(convertToBuildInformation).then(sendToClient);
}

module.exports = { all: all, id: id }