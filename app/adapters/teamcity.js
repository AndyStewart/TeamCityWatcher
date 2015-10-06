var request = require('request-promise');

function builds() {
	var options = {
			    uri : 'http://solicitors-build:8023/guestAuth/app/rest/builds/',
			    method : 'GET',
			    json: true
			};
	return request(options);
}

module.exports = {
	builds: builds
}