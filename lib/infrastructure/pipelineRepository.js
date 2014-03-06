var createPipeline = require("../domain/createPipeline");
var teamCity = require("./teamCity");

function getPipeline (callback) {
	teamCity.getBuildConfigurations("E-Subs", function(err, buildConfiguration) {
		var steps = [];
		for (var i = 0; i < buildConfiguration.buildTypes.buildType.length; i++) {
			var buildType = buildConfiguration.buildTypes.buildType[i];
			steps.push({ id: buildType.id, name: buildType.name });
		};
		return callback(null, createPipeline("E-Subs", steps));
	});
	
};

module.exports = {
	getPipeline : getPipeline
};