require("babel/register");

var should = require("should");
var Promise = require("bluebird");
var builds = require("../../app/queries/builds");

describe('Builds', function() {
	function buildResult(build) {
		return {
		            "id": build.id,
		            "buildTypeId": "bt12",
		            "number": "11510",
		            "status": build.status,
		            "state": "finished",
		            "href": "/guestAuth/app/rest/builds/id:40930",
		            "webUrl": "http://server-name/viewLog.html?buildId=40930&buildTypeId=bt12"
		        };
	}

  	describe('Get latest builds from server', function () {
		function allBuilds() {
			return new Promise(function (resolve, reject) {
						    		resolve({
						    			"build": [
									        buildResult({id: 40930, status: "FAILURE"}),
									        buildResult({id: 40927, status: "SUCCESS"}),
									        buildResult({id: 40926, status: "SUCCESS"}),
									        buildResult({id: 40925, status: "SUCCESS"}),
									        buildResult({id: 40924, status: "SUCCESS"}),
									        buildResult({id: 40923, status: "SUCCESS"})]
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
		function buildInformation(buildId) {
			return new Promise(function (resolve, reject) {
						    		resolve({
						    			"id": buildId,
						    			"status": 'FAILURE',
						    			"buildType": {
						    				id: 1,
						    				name: 'Build Name'
						    			},
						    			"statusText": 'Failed Broken tests'
						    			});
						    	});
		}
		it('returns the id of the build', function(done){
			builds.information(41039, buildInformation)
					.then(function(r) { r.id.should.equal(41039); done();});
		});

		it('returns the status of the build', function(done){
			builds.information(41039, buildInformation)
					.then(function(r) { 
							r.status.should.equal("FAILURE"); 
							done();
						});
		});

		it('returns the name of the build', function(done){
			builds.information(41039, buildInformation)
					.then(function(r) { r.name.should.equal("Build Name"); done();});
		});

		it('returns the status text of the build', function(done){
			builds.information(41039, buildInformation)
					.then(function(r) { r.statusText.should.equal("Failed Broken tests"); done();});
		});
	});
});
