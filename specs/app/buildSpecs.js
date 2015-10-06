var should = require("should");
var Promise = require("bluebird");
var builds = require("../../app/queries/builds");

describe('Builds', function() {
  	describe('Viewing Builds', function () {
	    it('build server results are converted to builds', function (done) {
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

	    	function allBuilds() {
				return new Promise(function (resolve, reject) {
							    		resolve({
							    			"build": [
										        buildResult({id: 40930, status: "FAILURE"}),
										        buildResult({id: 40927, status: "SUCCESS"})]
							    		});
							    	});
			}

	    	function verify(result) {
				result.length.should.equal(2);
				result[0].id.should.equal(40930);
				result[0].status.should.equal("FAILURE");

				result[1].id.should.equal(40927);
				result[1].status.should.equal("SUCCESS");
				result.length.should.equal(2);
				done();
	        }

	    	builds.all(allBuilds, verify);
		});
	});
});
