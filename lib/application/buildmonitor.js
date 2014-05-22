var _ = require('underscore');
var pipeline = require('../domain/pipeline');

function createPipelines(pipelineConfig, allBuilds) {
	return allBuilds.map(function(initialBuild) { 
		return pipeline.create(pipelineConfig, initialBuild);
	});
}

function getPipelines(buildRepository, pipelineConfigurationRepository, project, callback) {
	pipelineConfigurationRepository.getByName(project, function(err, pipelineConfig) {
		buildRepository.getBuildsByType(pipelineConfig.buildSteps[0].buildTypeId, function(err, startingBuilds) {
			var first5Builds = startingBuilds.slice(0, 5);
			return callback(err, createPipelines(pipelineConfig, first5Builds));
		});
	});
}

module.exports = {	
	getPipelines: getPipelines
};