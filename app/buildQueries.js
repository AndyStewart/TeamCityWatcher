function findAll(findServerBuilds) {
	function convertToBuild(serverResult)
	{	
		return serverResult.build.map(function(result) {
			return { status: result.status, id: result.id};
		})
	}
	return findServerBuilds().then(convertToBuild);
}
module.exports = { findAll: findAll }