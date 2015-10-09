var express = require('express');
var router = express.Router();

var builds = require('../app/queries/builds');
var teamcity = require('../app/adapters/teamcity');

router.get('/', function(req, res) {
	builds.pipelines(teamcity.builds)
		  .then(data => res.send(data));
});

router.get('/:id', function(req, res) {
	builds.information(req.params.id, teamcity.information)
		  .then(data => res.send(data));
});

module.exports = router;
