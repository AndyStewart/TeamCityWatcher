var User = require('./user');

var BuildStep = function(id, name, buildJobId){
	this.id = id;
	this.buildJobId = buildJobId;
	this.name = name;
	this.result = "Pending";
	this.startTime = '';
	this.percentageComplete ='';
	this.status = '';
	this.defects = '';
	this.changes = '';
	var _this = this;

	this.addBuild = function(extendedBuildInformation, changes) {
		var status = extendedBuildInformation.status;
		if (extendedBuildInformation.running) {
			status = "RUNNING";
			this.percentageComplete = extendedBuildInformation['running-info'].percentageComplete;
		}
	
		this.result = status;
		this.status = extendedBuildInformation.statusText;
		this.startTime = extendedBuildInformation.startDate;
		this.defects = _this.findDefectsOnBuild(extendedBuildInformation);
		this.changes = _this.parseChanges(changes);
	};

	this.parseChanges = function(changes) {
		var changeInformation = [];
		for(var i = 0; i < changes.length; i++) {
			var user = new User(changes[i]);
			if (this.containsUser(changeInformation, user.username) === false) {
				changeInformation.push(user);
			}
		}	
		return changeInformation;
	};

	this.containsUser = function(changeInformation, user){
		for(var i = 0; i < changeInformation.length; i++) {
			var change= changeInformation[i];
			if (change.username === user)
				return true;
		}

		return false;
	};

	this.findDefectsOnBuild = function(extendedBuildInformation) {
		var defects = [];
		if (extendedBuildInformation.relatedIssues !== undefined && extendedBuildInformation.relatedIssues.issueUsage !== undefined) {
			for (var i = extendedBuildInformation.relatedIssues.issueUsage.length - 1; i >= 0; i--) {
				var issue = extendedBuildInformation.relatedIssues.issueUsage[i].issue;
				defects[i] = issue.id;
			}
		}
		return defects;
	};
};

module.exports = BuildStep;