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

var Build = React.createClass({
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
	    return <div className={classes}>
				<h2>{this.state.name}:  </h2>
				{this.state.statusText}
				<div className="buildNumber">#{this.state.id}</div>
		   </div>;
  	}
});

function renderPipeline(pipeline) {
	return pipeline.builds.map(function(build) {
		return <div className="build-step"><Build build={build}/></div>;
	})
}

function loadPipelines(pipelines) {
	return pipelines.map(function(pipeline) {
		return <div>
					<h2>Branch: {pipeline.branchName}</h2>
					<div className="pipeline">
						{renderPipeline(pipeline)}
					</div>
				</div>;
	})
}

function displayMessage(err, pipelines) {
	React.render(<div>{loadPipelines(pipelines)}</div>, document.getElementById('output'));
}

function init() {
	get('/builds',displayMessage);
}