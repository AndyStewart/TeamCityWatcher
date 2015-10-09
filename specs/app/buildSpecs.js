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

describe('Builds', function() {
  	describe('Get latest builds from server', function () {
		function allBuilds() {
			return new Promise(function (resolve, reject) {
						    		resolve({
						    			"build": [
									        buildSummary({id: 40930, status: "FAILURE"}),
									        buildSummary({id: 40927, status: "SUCCESS"}),
									        buildSummary({id: 40926, status: "SUCCESS"}),
									        buildSummary({id: 40925, status: "SUCCESS"}),
									        buildSummary({id: 40924, status: "SUCCESS"}),
									        buildSummary({id: 40923, status: "SUCCESS"})]
						    		});
						    	});
		}

		it('returns maximum of 5 result', function (done) {
    		builds.all(allBuilds)
    				.then(function(r) {
    							r.length.should.equal(5);
    				    		done();
		    		});
    	});

		it('returns the id of the build', function (done) {
    		builds.all(allBuilds)
	    			.then(function(r){ 
		    			r[0].id.should.equal(40930);
		    			r[1].id.should.equal(40927);
		    			done();
		    		});
	    	});

		it('returns the status of the build', function (done) {
    		builds.all(allBuilds).then(function(r){ 
    			r[0].status.should.equal("FAILURE");
    			r[1].status.should.equal("SUCCESS");
    			done();
    		});
    	});

	});

	describe('Get information about a build', function() {
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
});
