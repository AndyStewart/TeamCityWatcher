var async = require('async');
var change = require('../domain/change');
var teamCity = require('./teamCity');


function getChangeById(id, callback) {
	console.log("Getting change: " + id);

	function parseChargeInformation(err, teamCityChange) {
		var change = (err) ? null : change.create(teamCityChange.username, teamCityChange.comment);
		callback(err, change);
	}
	
	teamCity.getChangeInformation(id, parseChargeInformation);
}

function noChangesFound(changes) {
	return (!changes || !changes.change);
}

function getChangesInBuild(buildId, callback) {
	console.log("Getting changes in build: " + buildId);
	if (buildId === undefined) {
		console.log("No BuildId Specified");
		return callback("No BuildId Specified", []);
	}

	function retrieveChangeDetails(err, changes) {
		var changeIds = getChangeIdsFromChange(changes)
		async.map(changeIds, getChangeById, callback);
	}

	teamCity.getChangesInBuild(buildId, retrieveChangeDetails);
}

function getChangeIdsFromChange(changes) {
	return noChangesFound(changes) ? [] : selectChangeIdsFromChanges(changes);
}

function selectChangeIdsFromChanges(changes) {
	return changes.change.map(function(change) {
		return change.id;
	});
}

module.exports = {
	getChangesInBuild: getChangesInBuild
};