var async = require('async');
var change = require('../domain/change');
var teamCity = require('./teamCity');

function noChangesFound(changes) {
	return (!changes || !changes.change);
}

function getChangeById(id, callback) {
	console.log("Getting change: " + id);
	teamCity.getChangeInformation(id, function(err, teamCityChange) {
		if (err) {
			return callback(err);
		}

		callback(err, change.create(teamCityChange.username, teamCityChange.comment))
	});
}

function getChangeIdsFromChange(changes) {
	if (noChangesFound(changes)) {
		return [];
	}

	return changes.change.map(function(change) {
		return change.id;
	})
}

function getChangesInBuild(buildId, callback) {
	console.log("Getting changes in build: " + buildId);
	if (buildId === undefined) {
		console.log("No BuildId Specified");
		return callback("No BuildId Specified", []);
	}

	teamCity.getChangesInBuild(buildId, function(err, changes) {
		var changeIds = getChangeIdsFromChange(changes)
		async.map(changeIds, getChangeById, callback);
	})
}

module.exports = {
	getChangesInBuild: getChangesInBuild
};