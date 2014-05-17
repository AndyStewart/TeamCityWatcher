var pipelineConfiguration = require("../domain/pipelineConfiguration");
var teamCity = require("./teamCity");

function convertBuildConfigurationToSteps(buildConfiguration) {
	var steps = [];
	for (var i = 0; i < buildConfiguration.buildTypes.buildType.length; i++) {
		var buildType = buildConfiguration.buildTypes.buildType[i];
		steps.push({ id: buildType.id, name: buildType.name });
	};
	return steps;
}

function getByName (projectName, callback) {
	teamCity.getBuildConfigurations(projectName, function(err, buildConfiguration) {
		var steps = convertBuildConfigurationToSteps(buildConfiguration)
		return callback(err, pipelineConfiguration.create(projectName, steps));
	});
};

module.exports = {
	getByName : getByName
};