function get(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	        callback(null, JSON.parse(xhr.responseText));
	    }
	}
	xhr.open('GET', url, true);
	xhr.send(null);
}

function loadProject(projectName, callback) {
	get('/buildstatus/' + projectName, function(err, result) {
		callback(err, { name: projectName, pipelines: result });
	});
}

function renderPipeline(projectName, pipeline) {
	var builds = pipeline.builds.map(function(build) {
		return React.createElement(Build, {projectName: projectName, build: build, pipeline: pipeline});
	});
	return React.createElement("div", {className: "row Pipeline"}, 
				React.createElement("div", {className: "col-md-12"}, 
					React.createElement("h4", null, "#", pipeline.number, " started at ", pipeline.startTime), 
					React.createElement(Changes, {pipeline: pipeline}), 
					React.createElement("div", {className: "row"}, 
					builds
					)
				)
			);
}

function renderProject(project) {
    var pipelines = project.pipelines.map(function(pipline) {
		return renderPipeline(project.name, pipline);
	});
	var component = React.createElement("div", null, 
						React.createElement("div", {className: "row"}, 
      						React.createElement("div", {className: "col-md-12"}, 
        						React.createElement("h1", {className: "text-center"}, project.name)
        					)
        				), 
                    	pipelines
					);

	React.render(component, document.getElementById('BuildMonitor'))
}

loadProject("E-Subs", function(err, project) {
	renderProject(project);
});
