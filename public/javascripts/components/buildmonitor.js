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

function renderPipeline(pipeline) {
	var builds = pipeline.builds.map(renderBuild);
	return <div className="row Pipeline">
				<div className="col-md-12">
					<h4>#{pipeline.number} started at {pipeline.startTime}</h4>
					<Changes pipeline={pipeline} />
					<div className="row">
					{builds}
					</div>
				</div>
			</div>;
}

function renderProject(project) {
    var pipelines = project.pipelines.map(renderPipeline);
	var component = <div>
						<div className="row">
      						<div className="col-md-12">
        						<h1 className="text-center">{project.name}</h1>
        					</div>
        				</div>
                    	{pipelines}
					</div>;

	React.render(component, document.getElementById('BuildMonitor'))
}

loadProject("E-Subs", function(err, project) {
	renderProject(project);
});
