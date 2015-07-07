function getProject(projectName, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	        callback(null, JSON.parse(xhr.responseText));
	    }
	}
	xhr.open('GET', '/buildstatus/' + projectName, true);
	xhr.send(null);
}

function loadMonitor(callback) {
	var projectName = "E-Subs";
	return getProject(projectName, function(err, result) {
		callback(err, { name: projectName, pipelines: result });
	});
}

function renderPipeline(pipeline) {
	return pipeline
		.builds
		.map(function(build) {
		return React.createElement("div", {className: "col-md-2 BuildResult"}, 
					React.createElement("div", {className: "row"}, 
						React.createElement("div", {className: "col-md-12 info"}, 
							React.createElement("div", {className: "row SUCCESS"}, 
								React.createElement("div", {className: "col-md-12"}, 
									React.createElement("h4", {className: "BuildInfo"}, build.name), 
									React.createElement("p", {className: "BuildInfo"}, 
										React.createElement("small", null, build.status)
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
	});
}
