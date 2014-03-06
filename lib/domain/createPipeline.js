
module.exports = function(name, buildSteps) {
	return {
		name: name,
		buildSteps: buildSteps,
		createRun: function(build) {
			var builds = [];
			for (var i = 0; i < buildSteps.length; i++) {
				var step = buildSteps[i];
				builds.push({
					name: step.name,
					buildTypeId: step.id,
					result: 'UNKNOWN',
				});
			};

			builds[0].id = build.id;
			builds[0].result = build.result;
			builds[0].status = build.status;
			builds[0].startTime = build.startTime;
			builds[0].percentageComplete = build.percentageComplete

			return {
				name: name,
				startTime: build.startTime,
				changes: build.changes,
				builds: builds,
				addBuild: function(build) {
					var buildFound = builds.filter(function(b) {
						return b.buildTypeId === build.buildTypeId;
					})[0];

					buildFound.id = build.id;
					buildFound.result = build.result;
					buildFound.status = build.status;
					buildFound.startTime = build.startTime;
					buildFound.percentageComplete = build.percentageComplete
				}
			};
		}
	};
}