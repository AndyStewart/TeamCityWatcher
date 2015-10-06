var express = require('express');
var router = express.Router();

var builds = require('../app/queries/builds');
var teamcity = require('../app/adapters/teamcity');

router.get('/', function(req, res) {
	builds.all(teamcity.builds, data => res.send(data));
});

router.get('/:id', function(req, res) {
	builds.id(req.params.id, teamcity.buildInfo, data => res.send(data));
});


module.exports = router;
