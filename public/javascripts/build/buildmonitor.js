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
	getProject(projectName, function(err, result) {
		callback(err, { name: projectName, pipelines: result });
	});
}

function renderBuild(project) {
    var pipelines = [];
    for (var i = 0; i < project.pipelines.length; i++) {
        var pipeline = project.pipelines[i];
        pipelines.push(React.createElement("div", {className: "row Pipeline"}, 
                      React.createElement("div", {className: "col-md-12"}, 
                        React.createElement("h4", null, "#", pipeline.number, " started at ", pipeline.startTime), 
                        React.createElement(Changes, {pipeline: pipeline}), 
						React.createElement("div", {className: "row"}, 
                        renderPipeline(pipeline)
						)
                      )
                    ));
    };

	var component = React.createElement("div", null, React.createElement("div", {className: "row"}, 
      					React.createElement("div", {className: "col-md-12"}, 
        					React.createElement("h1", {className: "text-center"}, project.name)
        				)
        			), 
                    pipelines);

	React.render(component, document.getElementById('BuildMonitor'))
}

loadMonitor(function(err, result) {
	renderBuild(result);
});
