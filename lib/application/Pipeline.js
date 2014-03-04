var BuildStep = require('./BuildStep');

function Pipeline(projectConfig, buildJob)
{
	this.builds = [];
	for (var i = projectConfig.buildTypes.buildType.length - 1; i >= 0; i--) {
		var buildType = projectConfig.buildTypes.buildType[i];
		this.builds.push(new BuildStep(buildType.id, buildType.name, buildJob.id));
	}
}

module.exports = Pipeline