
function createBuild(serverBuild) {
	return { status: serverBuild.status, id: serverBuild.id};
}

function convertToBuilds(serverResult) {
	return serverResult.build.map(createBuild);
}

function all(serverResults, sendToClient) {
	serverResults().then(convertToBuilds).then(sendToClient);
}

module.exports = { all: all }