var pipelineConfiguration = require("../domain/pipelineConfiguration");
var teamCity = require("./teamCity");
var async = require("async");

function getBuildStep(buildId, callback) {
	teamCity.getBuildType(buildId, function(err, fullBuildTypeInfo) {
			callback(null, { 
				id: fullBuildTypeInfo.id, 
				name: fullBuildTypeInfo.name,
				dependency: fullBuildTypeInfo['snapshot-dependencies']['snapshot-dependency'].id
			});
		});
}

function convertBuildConfigurationToSteps(buildConfiguration) {
	var steps = [];
	for (var i = 0; i < buildConfiguration.buildTypes.buildType.length; i++) {
		var buildType = buildConfiguration.buildTypes.buildType[i];
		steps.push(buildType.id);
	};
	return steps;
}

function getByName(projectName, callback) {
	teamCity.getBuildConfigurations(projectName, function(err, projectDetails) {
		var stepIds = convertBuildConfigurationToSteps(projectDetails);
		async.map(stepIds, getBuildStep, function(err, steps) {
			callback(null, pipelineConfiguration.create(projectName, steps));
		});
	});
}

module.exports = {
	getByName : getByName
};