function loadBuilds(builds) {
	return builds.map(function(build) {
		return React.createElement("div", null, 
				React.createElement("h1", null, build.status), 
				React.createElement("h1", null, build.id)
			   );
	})
}

function displayMessage(err, builds) {
	React.render(React.createElement("h1", null, loadBuilds(builds)), document.getElementById('output'));
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