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

describe('Generating a pipeline with where each pipeline contans one build', function() {
	var buildSummaries = { build: [ buildSummary({id:1}), 
									buildSummary({id:2}), 
									buildSummary({id:3}),
									buildSummary({id:4}), 
									buildSummary({id:5}), 
									buildSummary({id:6})] };

	function getLatestBuilds() {
		return new Promise(function (resolve, reject) {
					    		resolve(buildSummaries);
					    	});
	}

	it("Returns five pipelines", function(done) {
		builds.pipelines(getLatestBuilds)
			.then(function(results) {
				results.length.should.equal(5);
				done();
			});
	});

	it("Each pipeline contains 1 build", function(done) {
		builds.pipelines(getLatestBuilds)
			.then(function(results) {
				results[0].length.should.equal(1);
				results[1].length.should.equal(1);
				results[2].length.should.equal(1);
				done();
			});
	});

	it("Build has an id, name and statusText", function(done) {
		builds.pipelines(getLatestBuilds)
			.then(function(results) {
				results[0][0].id.should.equal(1);
				results[1][0].id.should.equal(2);
				results[2][0].id.should.equal(3);
				done();
			});
	});
});