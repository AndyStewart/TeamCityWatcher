function getBuilds(callback) {
	get('/builds/', callback);
}

function get(url, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
		callback(null, JSON.parse(xhttp.responseText));
    }
  }
  xhttp.open("GET", url, true);
  xhttp.send();
}

var Build = React.createClass({displayName: "Build",
	getInitialState: function() {
		return {
		  id: this.props.build.id,
		  name: "",
		  status: this.props.build.status,
		  statusText: ""
		};
	},
  	componentDidMount: function() {
	  	var _this = this;
	    get("/builds/" + this.props.build.id, function(err, result) {
	    	if (_this.isMounted()) {
		  		_this.setState({
				  id: result.id,
				  name: result.name,
				  status: result.status,
				  statusText: result.statusText
		        });
			}
	    });
  	},
  	render: function() {
		var classes = "build " + this.state.status;
	    return React.createElement("div", {className: classes}, 
				React.createElement("h2", null, this.state.name, ": ", this.state.id, " "), 
				this.state.statusText
		   );
  	}
});

function loadBuilds(builds) {
	return builds.map(function(build) {
		return React.createElement(Build, {build: build});
	})
}

function displayMessage(err, builds) {
	React.render(React.createElement("h1", null, loadBuilds(builds)), document.getElementById('output'));
}

function init() {
	getBuilds(displayMessage);
}