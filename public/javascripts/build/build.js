function getBuild(projectName, pipelineId, buildTypeId, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	        callback(null, JSON.parse(xhr.responseText));
	    }
	}
	xhr.open('GET', "/project/" + projectName + "/pipelines/" + pipelineId + "/builds/" + buildTypeId, true);
	xhr.send(null);
}

function renderBuild(build) {
	var component = React.createElement("div", null, 
			React.createElement("div", {class: "row {build.result}"}, 
			  React.createElement("div", {class: "col-md-12"}, 
			    React.createElement("h4", {class: "BuildInfo"}, build.name), 
			    React.createElement("p", {class: "BuildInfo"}, 
			      React.createElement("small", null, build.status)
			  	), 
			    React.createElement("p", {class: "BuildInfo"}, 
			      React.createElement("small", null, " ", build.startTime, " | date:'dd-MM-yyyy HH:mm:ss'    ")
			    )
			  )
			), 
			React.createElement("div", {class: "row"}, 
			  React.createElement("div", {class: "col-md-9"}, 
			    React.createElement("div", {class: "Percentage text-right"}, 
			     build.percentageComplete, " %"
			    )
			  ), 
			  React.createElement("div", {class: "col-md-3"}, 
			    React.createElement("div", {class: "icon"})
			  )
			)
			)
	React.render(component, document.getElementById('BuildInfo_40520'))
}

getBuild('E-Subs', 40520, 'ESubs_ESubs', function(err, result) {
                      renderBuild(result);
                      });