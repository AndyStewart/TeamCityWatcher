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
	return get("builds?locator=running:any");
}

function information(buildId) {
	return get("builds/id:" + buildId);
}

module.exports = {
	builds: builds,
	information: information
}