exports.create = function(name, buildSteps) {
	function reorderBuildSteps(correctOrder) {
		var build = correctOrder[correctOrder.length -1];
		var dependencyBuilds = buildSteps.filter(function(buildStep) {
			return buildStep.dependency === build.buildTypeId;
		});

		dependencyBuilds.forEach(function(build) {
			correctOrder.push(build);
		});

		if (dependencyBuilds.length > 0) {
			reorderBuildSteps(correctOrder)
		}
		return correctOrder;
	}
	
	return {
		name: name,
		buildSteps: reorderBuildSteps([buildSteps[0]])
	}
}