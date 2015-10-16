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
	    get("/builds/" + this.props.build.id, (err, result) => {
	    	if (this.isMounted()) {
		  		this.setState({
				  id: result.id,
				  name: result.name,
				  status: result.status,
				  statusText: result.statusText
		        });
			}
	    });
  	},
  	render: function() {
		var classes = "build-result " + this.state.status;
	    return React.createElement("div", {className: classes}, 
				React.createElement("h2", null, this.state.name, ": ", this.state.id, " "), 
				this.state.statusText
		   );
  	}
});

function renderPipeline(pipeline) {
	return pipeline.map(function(build) {
		return React.createElement("div", {className: "build-step"}, React.createElement(Build, {build: build}));
	})
}

function loadPipelines(pipelines) {
	return pipelines.map(function(pipeline) {
		return React.createElement("div", {className: "pipeline"}, renderPipeline(pipeline));
	})
}

function displayMessage(err, pipelines) {
	React.render(React.createElement("div", null, loadPipelines(pipelines)), document.getElementById('output'));
}

function init() {
	get('/builds',displayMessage);
}