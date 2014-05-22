exports.create = function(pipelineConfiguration, startingBuild) {	
	return {
		id: startingBuild.id,
		name: pipelineConfiguration.name,
		startTime: startingBuild.startDate,
		builds: pipelineConfiguration.buildSteps
	};
}