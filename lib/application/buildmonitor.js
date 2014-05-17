var _ = require('underscore');
var pipeline = require('../domain/pipeline');

function applyDependentBuilds(run, lastBuild, builds) {
	var dependentBuilds = _.filter(builds, function(build) {
		return build.dependencies.some(function(dependency) {
			return dependency.id === lastBuild.id;
		});
	});

	for (var i = 0; i < dependentBuilds.length; i++) {
		run.addBuild(dependentBuilds[i]);
		applyDependentBuilds(run, dependentBuilds[i], builds);
	};
}

function getLast5StartingBuilds(builds) {
	return _.filter(builds, function(build) {
				return build.dependencies.length === 0;
			}).slice(0, 5);
}

function createPipelineRun(lastBuild, pipelineConfig, builds) {
	var run = pipeline.create(pipelineConfig, lastBuild);
	applyDependentBuilds(run, run.builds[0], builds);
	return run;	
}

function convertBuildsToPipelineRuns(pipelineConfig, last5Builds, builds) {
	var pipelinesRuns = [];
	for (var i = 0; i < last5Builds.length; i++) {
		var run = createPipelineRun(last5Builds[i], pipelineConfig, builds);
		pipelinesRuns.push(run);
	};
	return pipelinesRuns;	
}

function getPipelines(buildRepository, pipelineConfigurationRepository, project, callback) {
	pipelineConfigurationRepository.getByName(project, function(err, pipelineConfig) {
		buildRepository.getAllBuilds(project, function(err, builds) {
			var last5Builds = getLast5StartingBuilds(builds);
			var pipelineRuns = convertBuildsToPipelineRuns(pipelineConfig, last5Builds, builds);
  			return callback(null, pipelineRuns);
		});
	});
}

module.exports = {	
	getPipelines: getPipelines
};