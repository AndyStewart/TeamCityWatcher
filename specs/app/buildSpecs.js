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
									        buildResult({id: 40927, status: "SUCCESS"})]
						    		});
						    	});
		}

		it('returns correct amount of results', function (done) {
    		builds.all(allBuilds, function(r) { r.length.should.equal(2) });
    		done();
    	});

		it('returns the id of the build', function (done) {
    		builds.all(allBuilds, function(r){ 
    			r[0].id.should.equal(40930);
    			r[1].id.should.equal(40927);
    			done();
    		});
    	});

		it('returns the status of the build', function (done) {
    		builds.all(allBuilds, function(r){ 
    			r[0].status.should.equal("FAILURE");
    			r[1].status.should.equal("SUCCESS");
    			done();
    		});
    	});

	});
});
