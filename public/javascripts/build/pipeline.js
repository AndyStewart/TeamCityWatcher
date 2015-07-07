var Build = React.createClass({displayName: "Build",
	getInitialState: function() {
		return this.props.build;
	},
	componentDidMount: function() {
		var _this = this;
		var url = "/project/" + this.props.projectName + "/pipelines/" + this.props.pipeline.id + "/builds/" + this.props.build.buildTypeId;
		get(url, function(error, result) {
			_this.setState(result);
		})
	},
	render: function() {
		var build = this.state;
		var buildStatus = "row ";
		if (build.result === undefined) {
			buildStatus = buildStatus + "UNKNOWN";
		} else {
			buildStatus = buildStatus + build.result
		}
		return React.createElement("div", {className: "col-md-2 BuildResult"}, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-md-12 info"}, 
							React.createElement("div", {className: buildStatus}, 
								React.createElement("div", {className: "col-md-12"}, 
									React.createElement("h4", {className: "BuildInfo"}, build.name), 
									React.createElement("p", {className: "BuildInfo"}, 
										React.createElement("small", null, build.status, "  ")
									), 
									React.createElement("p", {"ng-className": "{showTime: !build.startTime}", className: "BuildInfo"}, 
										React.createElement("small", null, "07-07-2015 16:33:46  ")
									)
								)
							), 
							React.createElement("div", {className: "row"}, 
								React.createElement("div", {className: "col-md-9"}, 
									React.createElement("div", {className: "Percentage text-right "}, " %"
									)
								), 
								React.createElement("div", {className: "col-md-3"}, 
									React.createElement("div", {className: "icon"}
									)
								)
							)
						)
					)
				);
	}
});
