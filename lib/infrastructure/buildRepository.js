var teamCity = require('./teamCity');
var async = require('async');

var build = require('../domain/build');

function convertTeamCityBuilds(teamCityBuild) {
	return {
				id: teamCityBuild.id,
				number: teamCityBuild.number,
				name: teamCityBuild.name,
				buildTypeId: teamCityBuild.buildTypeId,
				startDate: teamCityBuild.startDate,
			};
}

function parseTeamCityBuildsResults(callback) {
	return function(err, builds) {
		var actualBuilds = builds.build.map(convertTeamCityBuilds);
		return callback(err, actualBuilds);
	};
}

function getBuildsByType(buildTypeId, callback) {
	teamCity.getBuildsForBuildType(buildTypeId, parseTeamCityBuildsResults(callback));
}

function getAllBuilds(project, callback) {
	teamCity.getBuildsForProject(project, parseTeamCityBuildsResults(callback));
}

function getById(buildId, callback) {
	if (buildId === undefined) {
		return callback("No build id specified");
	}
	
	teamCity.getBuildInformation(buildId, function(err, result) {
		var newBuild = build.create(result);
		callback(err, newBuild);
	});
}

module.exports = {
	getById: getById,
	getAllBuilds: getAllBuilds,
	getBuildsByType: getBuildsByType
};