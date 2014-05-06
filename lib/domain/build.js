exports.create = function(teamCityBuild) {
	var build = {
        name: teamCityBuild.buildType.name,
        buildTypeId: teamCityBuild.buildType.id,
        result: teamCityBuild.status,
        id: teamCityBuild.id,
        status: teamCityBuild.statusText,
        startTime: teamCityBuild.startDate
      };

	if (teamCityBuild.running) {
		build.result = "RUNNING";
		build.percentageComplete = teamCityBuild['running-info'].percentageComplete;
	}

    return build;
};