var _ = require('underscore');

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

function createPipelineRun(lastBuild, pipeline, builds) {
	var run = pipeline.createRun(lastBuild);
	applyDependentBuilds(run, run.builds[0], builds);
	return run;	
}

function convertBuildsToPipelineRuns(pipeline, last5Builds, builds) {
	var pipelinesRuns = [];
	for (var i = 0; i < last5Builds.length; i++) {
		var run = createPipelineRun(last5Builds[i], pipeline, builds);
		pipelinesRuns.push(run);
	};
	return pipelinesRuns;	
}

function getPipelines(buildRepository, pipelineRepository, project, callback) {
	var builds = pipelineRepository.getPipeline(project, function(err, pipeline) {
		buildRepository.getAllBuilds(project, function(err, builds) {
			var last5Builds = getLast5StartingBuilds(builds);
			var pipelineRuns = convertBuildsToPipelineRuns(pipeline, last5Builds, builds);
  			return callback(null, pipelineRuns);
		});
	});
}

module.exports = {	
	getPipelines: getPipelines
};