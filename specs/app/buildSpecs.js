require("babel/register");

var should = require("should");
var Promise = require("bluebird");
var builds = require("../../app/queries/builds");

function buildSummary(build) {
	return {
				"id": build.id,
				"buildTypeId": "bt12",
				"number": "11510",
				"status": build.status,
				"state": "finished",
				"href": "/guestAuth/app/rest/builds/id:" + build.id,
				"webUrl": "http://server-name/viewLog.html?buildId=40930&buildTypeId=bt12"
			};
}

function buildInformation(buildId, builds)
		{
			return {
				"id": buildId,
				"status": 'FAILURE',
				"buildType": {
					id: 1,
					name: 'Build Name'
				},
				"branchName": "master",
				"statusText": 'Failed Broken tests',
				"startDate": "20151008T180742+0100",
				"finishDate": "20151008T180751+0100",
					"snapshot-dependencies": {
				    "count": 1,
				    "build": builds,
			    },
				  "artifact-dependencies": {
				    "count": 1,
				    "build": builds,
					}
			}
		}

describe('Get information about a build', function() {
	function getBuildInfo(buildId) {
		return new Promise(function (resolve, reject) {
					    		resolve(buildInformation(buildId,[buildSummary({id: 40930, status: "FAILURE"})]));
					    	});
	}
	it('returns the id of the build', function(done){
		builds.information(41039, getBuildInfo)
				.then(function(r) { r.id.should.equal(41039); done();});
	});

	it('returns the status of the build', function(done){
		builds.information(41039, getBuildInfo)
				.then(function(r) { 
						r.status.should.equal("FAILURE"); 
						done();
					});
	});

	it('returns the name of the build', function(done){
		builds.information(41039, getBuildInfo)
				.then(function(r) { r.name.should.equal("Build Name"); done();});
	});

	it('returns the status text of the build', function(done){
		builds.information(41039, getBuildInfo)
				.then(function(r) { r.statusText.should.equal("Failed Broken tests"); done();});
	});
});

describe('Generating a pipeline with builds relate to each other by snapshot dependencies', function() {
	var buildSummaries = { build: [ buildSummary({id:4}),
									buildSummary({id:3}),
									buildSummary({id:2}), 
									buildSummary({id:1})
									] };

	var buildInformations = { "4": buildInformation(4, [buildSummary({id:3})]),
							  "3": buildInformation(3, [buildSummary({id:2})]),
							  "2": buildInformation(2, [buildSummary({id:1})]),
							  "1": buildInformation(1, []) };

	function getLatestBuilds() {
		return new Promise(function (resolve, reject) {
					    		resolve(buildSummaries);
					    	});
	}

	function getBuildInfo(buildId) {
		return new Promise(function (resolve, reject) {
					    		resolve(buildInformations[buildId]);
					    	});
	}

	it("Should have 1 pipeline", function(done) {
			builds.generateBuildScreen(getLatestBuilds, getBuildInfo)
				.then(function(results) {
					results.length.should.equal(1);
					done();
				});
		});

	it("Pipeline contains 3 builds", function(done) {
		builds.generateBuildScreen(getLatestBuilds, getBuildInfo)
			.then(function(results) {
				results[0].builds.length.should.equal(4);
				done();
			});
	});
});

describe('Generating a pipeline with where each pipeline contans one build', function() {
		var buildSummaries = { build: [ buildSummary({id:1}), 
										buildSummary({id:2}), 
										buildSummary({id:3}),
										buildSummary({id:4}), 
										buildSummary({id:5}), 
										buildSummary({id:6})] };

		var buildInformations = { "6": buildInformation(6, []),
								  "5": buildInformation(5, []),
								  "4": buildInformation(4, []),
								  "3": buildInformation(3, []),
								  "2": buildInformation(2, []),
								  "1": buildInformation(1, []) };

		function getLatestBuilds() {
			return new Promise(function (resolve, reject) {
						    		resolve(buildSummaries);
						    	});
		}

		function getBuildInfo(buildId) {
			return new Promise(function (resolve, reject) {
						    		resolve(buildInformations[buildId]);
						    	});
		}

		it("Pipeline has a branch name", function(done) {
			builds.generateBuildScreen(getLatestBuilds, getBuildInfo)
				.then(function(results) {
					results[0].branchName.should.equal('master');
					done();
				});
		});

		it("Returns five pipelines", function(done) {
			builds.generateBuildScreen(getLatestBuilds, getBuildInfo)
				.then(function(results) {
					results.length.should.equal(5);
					done();
				});
		});

		it("Each pipeline contains 1 build", function(done) {
			builds.generateBuildScreen(getLatestBuilds, getBuildInfo)
				.then(function(results) {
					results[0].builds.length.should.equal(1);
					results[1].builds.length.should.equal(1);
					results[2].builds.length.should.equal(1);
					done();
				});
		});

		it("Build has an id", function(done) {
			builds.generateBuildScreen(getLatestBuilds, getBuildInfo)
				.then(function(results) {
					results[0].builds[0].id.should.equal(1);
					results[1].builds[0].id.should.equal(2);
					results[2].builds[0].id.should.equal(3);
					done();
				});
		});
	});