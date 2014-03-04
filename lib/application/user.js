var crypto = require('crypto');

var User = function(change) { 
	var userParts = change.username.split(' <');
	var emailAddress = userParts[1].substring(0, userParts[1].length - 1);
	var shasum = crypto.createHash('md5');
	shasum.update(emailAddress);
	this.username = userParts[0];
	this.email = emailAddress;
	this.hash = shasum.digest('hex');
};

module.exports = User;