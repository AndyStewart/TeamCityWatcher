exports.create = function(teamCityBuild) {
	var build = {
        id: teamCityBuild.id,
        number: teamCityBuild.number + "asdas",
        name: teamCityBuild.buildType.name,
        result: teamCityBuild.status,
        status: teamCityBuild.statusText,
        startTime: teamCityBuild.startDate,
        buildTypeId: teamCityBuild.buildType.id
    };

    if (teamCityBuild['snapshot-dependencies']) {
        build.dependencies = teamCityBuild['snapshot-dependencies'].build.map(function(dependency) {
            return { id: dependency.id, buildTypeId: dependency.buildTypeId };
        });
    } else {
        build.dependencies = [];
    }

	if (teamCityBuild.running) {
		build.result = "RUNNING";
		build.percentageComplete = teamCityBuild['running-info'].percentageComplete;
	}

    build.isComplete = (build.result === 'FAILURE' || build.result === 'SUCCESS');
    return build;
};