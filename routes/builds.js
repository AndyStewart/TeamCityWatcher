var express = require('express');
var router = express.Router();

var app = require('../app/queries/buildQueries');
var teamcity = require('../app/adapters/teamcity');

/* GET users listing. */
router.get('/', function(req, res) {
	var findAllBuilds = teamcity.getAllbuilds()
								.then(app.convertToBuilds)
								.then(function(data) {
									res.send(data);		
								});
});

module.exports = router;
