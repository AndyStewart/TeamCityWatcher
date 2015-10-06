var request = require('request-promise');

function getAllbuilds() {
	var options = {
			    uri : 'http://solicitors-build:8023/guestAuth/app/rest/builds/',
			    method : 'GET',
			    json: true
			};
	return request(options);
}

module.exports = {
	getAllbuilds: getAllbuilds
}