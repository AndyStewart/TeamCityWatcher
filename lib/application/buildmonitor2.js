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

function getPipelines(buildRepository, pipelineRepository, callback) {
	var builds = pipelineRepository.getPipeline(function(err, pipeline) {
		buildRepository.getAllBuilds(function(err, builds) {
			var pipelinesRuns = [];

			var last5Builds = _.filter(builds, function(build) {
				return build.dependencies.length === 0;
			}).slice(0, 5);

			for (var i = 0; i < last5Builds.length; i++) {
				var build = last5Builds[i];
				var run = pipeline.createRun(build);
				applyDependentBuilds(run, run.builds[0], builds);
				pipelinesRuns.push(run);
			};

			return callback(null, pipelinesRuns);
		});
	});
}

module.exports = {	
	getPipelines: getPipelines
};