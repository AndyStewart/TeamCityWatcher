function build(serverBuild) {
	return { status: serverBuild.status, id: serverBuild.id};
}

function convertToBuilds(serverResult) {
	return serverResult.build.map(build);
}

module.exports = { convertToBuilds: convertToBuilds }