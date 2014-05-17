var async = require('async');
var change = require('../domain/change');
var teamCity = require('./teamCity');

function noChangesFound(changes) {
	return (!changes || !changes.change);
}

function getChangeInformation(change, callback) {
	teamCity.getChangeInformation(change.id, callback);
}

function getChangesInBuild(buildId, callback) {
	if (buildId === undefined) {
		console.log("No BuildId Specified");
		return callback("No BuildId Specified", []);
	}

	teamCity.getChangesInBuild(buildId, function(err, changes) {
		if (noChangesFound(changes)) {
			return;
		}

		function createChangeFromTeamCityChange(err, teamCityChanges) {
			var changes = [];
			teamCityChanges.forEach(function(item) {
				changes.push(change.create(item.username, item.comment));
			})
			callback(null, changes);
		}

		async.map(changes.change, getChangeInformation, createChangeFromTeamCityChange);
	})
}

module.exports = {
	getChangesInBuild: getChangesInBuild
};