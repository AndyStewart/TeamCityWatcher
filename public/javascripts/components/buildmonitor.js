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
        pipelines.push(<div className="row Pipeline">
                      <div className="col-md-12">
                        <h4>#{pipeline.number} started at {pipeline.startTime}</h4>
                        <Changes pipeline={pipeline} />
						<div className="row">
                        {renderPipeline(pipeline)}
						</div>
                      </div>
                    </div>);
    };

	var component = <div><div className="row">
      					<div className="col-md-12">
        					<h1 className="text-center">{project.name}</h1>
        				</div>
        			</div>
                    {pipelines}</div>;

	React.render(component, document.getElementById('BuildMonitor'))
}

loadMonitor(function(err, result) {
	renderBuild(result);
});
