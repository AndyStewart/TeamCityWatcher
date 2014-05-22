var _ = require('underscore');
var pipeline = require('../domain/pipeline');


function build(buildRepository, pipelineConfigurationRepository, project, callback) {

	function convertFirst5BuildsToPipelines(pipelineConfig) {
		return function(err, startingBuilds) {
			var first5Builds = startingBuilds.slice(0, 5);
			var pipelines = first5Builds.map(function(initialBuild) { 
				return pipeline.create(pipelineConfig, initialBuild);
			});
			return callback(err, pipelines);
		};
	}
	function getBuildsInPipelineConfig (err, pipelineConfig) {	
		buildRepository.getBuildsByType(pipelineConfig.buildSteps[0].buildTypeId, convertFirst5BuildsToPipelines(pipelineConfig));
	}

	pipelineConfigurationRepository.getByName(project, getBuildsInPipelineConfig);
}

module.exports = {	
	build: build
};