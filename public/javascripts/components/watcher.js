function loadBuilds(builds) {
	return builds.map(function(build) {
		return <div>
				<h1>{build.status}</h1>
				{build.id}
			   </div>;
	})
}

function displayMessage(err, builds) {
	React.render(<h1>{loadBuilds(builds)}</h1>, document.getElementById('output'));
}

function getBuilds(callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
		callback(null, JSON.parse(xhttp.responseText));
    }
  }
  xhttp.open("GET", "/builds", true);
  xhttp.send();
}

function init() {
	getBuilds(displayMessage);
}