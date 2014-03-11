var crypto = require('crypto');

exports.create = function(userAndEmail, comment) {
	var userParts = userAndEmail.split(' <');
	var emailAddress = userParts[1].substring(0, userParts[1].length - 1);
	var shasum = crypto.createHash('md5');
	shasum.update(emailAddress);
	return {
		username: userParts[0],
		email: emailAddress,
		hash: shasum.digest('hex'),
		comment: comment
	};
}