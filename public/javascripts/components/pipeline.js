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
		return <div className="col-md-2 BuildResult">
					<div className="row">
						<div className="col-md-12 info">
							<div className="row SUCCESS">
								<div className="col-md-12">
									<h4 className="BuildInfo">{build.name}</h4>
									<p className="BuildInfo">
										<small>{build.status}</small>
									</p>
									<p ng-className="{showTime: !build.startTime}" className="BuildInfo">
										<small>07-07-2015 16:33:46 &nbsp;</small>
									</p>
								</div>
							</div>
							<div className="row">
								<div className="col-md-9">
									<div className="Percentage text-right "> %
									</div>
								</div>
								<div className="col-md-3">
									<div className="icon">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>;
	});
}
