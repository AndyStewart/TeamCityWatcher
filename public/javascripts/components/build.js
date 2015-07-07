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
	var component = <div>
			<div class='row {build.result}'>
			  <div class='col-md-12'>
			    <h4 class='BuildInfo'>{build.name}</h4>
			    <p class="BuildInfo">
			      <small>{build.status}</small>
			  	</p>
			    <p class="BuildInfo">
			      <small> {build.startTime} | date:'dd-MM-yyyy HH:mm:ss'   &nbsp;</small>
			    </p>
			  </div>
			</div>
			<div class='row'>
			  <div class='col-md-9'>
			    <div class='Percentage text-right'>
			     {build.percentageComplete} %
			    </div>
			  </div>
			  <div class='col-md-3'>
			    <div class='icon'></div>
			  </div>
			</div>
			</div>
	React.render(component, document.getElementById('BuildInfo_40520'))
}

getBuild('E-Subs', 40520, 'ESubs_ESubs', function(err, result) {
                      renderBuild(result);
                      });