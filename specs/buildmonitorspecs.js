var should = require("should");

var buildInformationFactory = function(overides) {
	var defaults = { 
						id: 2043,
						number: '1',
						status: 'SUCCESS',
						branchName: 'refs/heads/develop',
						defaultBranch: true,
						statusText: 'Tests passed: 2431',
						startDate: '20131113T150355+0000',
						finishDate: '20131113T151351+0000',
						relatedIssues: {}
					};
	overides(defaults);
	return defaults;
};

var buildSummaryFactory = function(overides) {
	var defaults = { id: 1, status: 'SUCCESS', branchName:'refs/heads/develop', defaultBranch:true };
	overides(defaults);
	return defaults;
};

describe("When loading the build monitor for with no running builds", function() {
	var resultsReturned;
	
	beforeEach(function(done) {
		var fakeTeamCity = {
			getBuildInformation: function(id, callback) {
				callback(null, buildInformationFactory(function(obj) { obj.statusText = "Tests passed: 2431"; }));
			},
			getBuildsForBuildType: function(id, callback) { 
				callback(null, { build : [
						buildSummaryFactory(function(obj) { 
							obj.status = 'SUCCESS'; 
						}),
						buildSummaryFactory(function(obj) { obj.status = 'FAIL'; }),
						buildSummaryFactory(function(obj) { obj.status = 'SUCCESS'; }),
					]});
				},
			getChangesInBuild: function(id, callback) {
				callback(null, {
						change: [{id: 1},
								{id: 2}]
				});
			},
			getChangeInformation: function(id, callback) {
				callback(null, {
						username: 'andrew.stewart <andrew.stewart@advancedcomputersoftware.com>'
				});
			},
		};

		var buildMonitor = require("../lib/application/buildmonitor")(fakeTeamCity);
		buildMonitor.getStatus(function(err, results) {
			resultsReturned = results;
			done();
		});
	});

	it("Should return latest develop build result", function() {
		resultsReturned.develop.result.should.equal("SUCCESS");
	});

	it("Should return latest develop build status", function() {
		resultsReturned.develop.status.should.equal("Tests passed: 2431");
	});

	it("Should return latest develop changes", function() {
		resultsReturned.develop.changes.length.should.equal(1);
		resultsReturned.develop.changes[0].username.should.equal("andrew.stewart");
		resultsReturned.develop.changes[0].email.should.equal("andrew.stewart@advancedcomputersoftware.com");
	});

	it("Should show latest develop start time", function() {
		resultsReturned.develop.startTime.should.equal("20131113T150355+0000");
	});
});

describe("When loading the build monitor default branch with running builds", function() {
	var resultsReturned;
	beforeEach(function(done){
		var fakeTeamCity = {
			getBuildInformation: function(id, callback) {
				callback(null, buildInformationFactory(function(obj) { obj.statusText = "Tests passed: 2431"; }));
			},
			getBuildsForBuildType: function(id, callback) { 
				callback(null, {build : [
						buildSummaryFactory(function(obj) { 
												obj.running = "true";
												obj.percentageComplete = "15";
											}),
						buildSummaryFactory(function(obj) { obj.status = 'FAIL'; }),
						buildSummaryFactory(function(obj) { obj.status = 'SUCCESS'; }),
					]});
				},
			getChangesInBuild: function(id, callback) {
				callback(null, {
						change: [{id: 1},
								{id: 2}]
				});
			},
			getChangeInformation: function(id, callback) {
				callback(null, {
						username: username='andrew.stewart <andrew.stewart@advancedcomputersoftware.com>'
				});
			},
			};
		
		var buildMonitor = require("../lib/application/buildmonitor")(fakeTeamCity);

		buildMonitor.getStatus(function(err, results) {
			resultsReturned = results;
			done();
		});		
	});

	it("Should return that a build is running", function() {
		resultsReturned.develop.result.should.equal("RUNNING");
	});

	it("Should return percentage complete", function() {
		resultsReturned.develop.percentageComplete.should.equal("15");
	});
});

describe("When loading the build monitor for default branch with issues", function() {
	var resultsReturned;
	
	beforeEach(function(done) {
		var fakeTeamCity = {
			getBuildInformation: function(id, callback) {
				callback(null, buildInformationFactory(function(obj) {
					obj.statusText = "Tests passed: 2431";
					obj.relatedIssues.issueUsage = [
						{
							change: [],
							issue : {id: "LCSILB-19307", url:""}
						},{
							change: [],
							issue : {id: "LCSILB-19308", url:""}
						}];
				}));
			},
			getBuildsForBuildType: function(id, callback) { 
				callback(null, {build : [
						buildSummaryFactory(function(obj) { obj.status = 'SUCCESS'; }),
						buildSummaryFactory(function(obj) { obj.status = 'FAIL'; }),
						buildSummaryFactory(function(obj) { obj.status = 'SUCCESS'; }),
					]});
				},
			getChangesInBuild: function(id, callback) {
				callback(null, {
						change: [{id: 1},
								{id: 2}]
				});
			},
			getChangeInformation: function(id, callback) {
				callback(null, {
						username:'andrew.stewart <andrew.stewart@advancedcomputersoftware.com>'
				});
			}
		};
		
		var buildMonitor = require("../lib/application/buildmonitor")(fakeTeamCity);
		buildMonitor.getStatus(function(err, results) {
			resultsReturned = results;
			done();
		});
	});

	it("Should return latest build result", function() {
		resultsReturned.develop.result.should.equal("SUCCESS");
	});

	it("Should return latest build status", function() {
		resultsReturned.develop.status.should.equal("Tests passed: 2431");
	});

	it("Should show start time", function() {
		resultsReturned.develop.startTime.should.equal("20131113T150355+0000");
	});

	it("Should return defects in build status", function() {
		resultsReturned.develop.defects[0].should.equal("LCSILB-19307");
		resultsReturned.develop.defects[1].should.equal("LCSILB-19308");
	});
});