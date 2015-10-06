var should = require("should");
var Promise = require("bluebird");
var buildQueries = require("../../app/buildQueries");

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

    	function findBuildsOnServer() {
    		return new Promise(function (resolve, reject) {
	    		resolve({
	    			"build": [
				        buildResult({id: 40930, status: "FAILURE"}),
				        buildResult({id: 40927, status: "SUCCESS"})]
	    		});
	    	});
    	}

    	var findAllQuery = buildQueries.newFindAllQuery(findBuildsOnServer);
        findAllQuery().then(function(result) {
        	result.length.should.equal(2);
        	result[0].id.should.equal(40930);
        	result[0].status.should.equal("FAILURE");
        	
        	result[1].id.should.equal(40927);
        	result[1].status.should.equal("SUCCESS");
        	result.length.should.equal(2);
        	done();
        });
    });
  });
});