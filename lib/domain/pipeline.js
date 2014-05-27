exports.create = function(pipelineConfiguration, startingBuild) {	
	return {
		id: startingBuild.id,
		number: startingBuild.number,
		name: pipelineConfiguration.name,
		startTime: startingBuild.startDate,
		builds: pipelineConfiguration.buildSteps
	};
}