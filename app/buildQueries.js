function newFindAllQuery(findServerBuilds) {
	return function () {
		function convertToBuild(serverResult)
		{	
			return serverResult.build.map(function(result) {
				return { status: result.status, id: result.id};
			})
		}

		return findServerBuilds().then(convertToBuild);
	}
}
module.exports = { newFindAllQuery: newFindAllQuery }