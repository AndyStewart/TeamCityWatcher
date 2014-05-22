exports.create = function(pipelineConfiguration, startingBuild) {
	var builds = pipelineConfiguration.buildSteps;
	builds[0].id = startingBuild.id;
	
	return {
		id: startingBuild.id,
		name: pipelineConfiguration.name,
		startTime: startingBuild.startDate,
		builds: pipelineConfiguration.build
	};
}