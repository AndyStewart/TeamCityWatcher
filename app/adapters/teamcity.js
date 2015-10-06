var request = require('request-promise');

function get(path) {
	var options = {
			    uri : 'http://solicitors-build:8023/guestAuth/app/rest/' + path,
			    method : 'GET',
			    json: true
			};
	return request(options);
}

function builds() {
	return get("builds");
}

function buildInfo(buildId) {
	return get("builds/id:" + buildId);
}

module.exports = {
	builds: builds,
	buildInfo: buildInfo
}