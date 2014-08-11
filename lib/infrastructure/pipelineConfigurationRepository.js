var pipelineConfiguration = require("../domain/pipelineConfiguration");
var teamCity = require("./teamCity");
var async = require("async");

function getBuildStep(buildId, callback) {
	teamCity.getBuildType(buildId, function(err, fullBuildTypeInfo) {
		var dependency = "";
		if (fullBuildTypeInfo['snapshot-dependencies']['snapshot-dependency'].length > 0) {
			dependency = fullBuildTypeInfo['snapshot-dependencies']['snapshot-dependency'][0].id;
		}
			callback(null, { 
				buildTypeId: fullBuildTypeInfo.id, 
				name: fullBuildTypeInfo.name,
				dependency: dependency
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