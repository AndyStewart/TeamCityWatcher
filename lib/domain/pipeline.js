
exports.create = function(pipelineConfiguration, initialBuild) {
	var name = pipelineConfiguration.name;
	var buildSteps = pipelineConfiguration.buildSteps;
	var builds = [];
	for (var i = 0; i < buildSteps.length; i++) {
		var step = buildSteps[i];
		builds.push({
			id: 0,
			name: step.name,
			number: step.number,
			buildTypeId: step.id,
			update: function(initialBuild) {
				this.id = initialBuild.id;
			}
		});
	};

	builds[0].update(initialBuild);

	return {
		id: initialBuild.id,
		name: name,
		startTime: initialBuild.startTime,
		number: initialBuild.number,
		changes: initialBuild.changes,
		builds: builds,
		addBuild: function(initialBuild) {
			var buildFound = builds.filter(function(b) {
				return b.buildTypeId === initialBuild.buildTypeId;
			})[0];
			buildFound.update(initialBuild);
		}
	};
}