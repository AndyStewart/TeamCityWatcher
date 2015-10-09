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
		var classes = "build " + this.state.status;
	    return <div className={classes}>
				<h2>{this.state.name}: {this.state.id} </h2>
				{this.state.statusText}
		   </div>;
  	}
});

function loadBuilds(builds) {
	return builds.map(function(build) {
		return <Build build={build}/>;
	})
}

function displayMessage(err, builds) {
	React.render(<h1>{loadBuilds(builds)}</h1>, document.getElementById('output'));
}

function init() {
	get('/builds',displayMessage);
}