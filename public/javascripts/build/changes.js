function getChanges(projectName, pipeline, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
	        callback(null, JSON.parse(xhr.responseText));
	    }
	}
	xhr.open('GET', "/project/" + projectName + "/pipelines/" + pipeline.id + "/changes", true);
	xhr.send(null);
}

var Changes = React.createClass({displayName: "Changes",
	getInitialState: function() {
		return { changes: [] };
	},
	componentDidMount: function() {
		var _this = this;
		getChanges(this.props.pipeline.name, this.props.pipeline, function(err, result) {
			_this.setState({changes: result});
		});
	},
	render: function() {
		var changes = this.state
			.changes
			.slice(0, 3)
			.map(function(change) {
				return React.createElement("div", {className: "row"}, 
			              React.createElement("div", {className: "col-md-12 info"}, 
			                React.createElement("div", {className: "row"}, 
			                  React.createElement("div", {className: "col-md-9"}, 
			                    React.createElement("div", {className: "row"}, 
			                      React.createElement("div", {className: "col-md-12"}, 
			                        React.createElement("strong", {className: "username"}, change.username)
			                      )
			                    ), 
			                    React.createElement("div", {className: "row"}, 
			                      React.createElement("div", {className: "col-md-12"}, 
			                        React.createElement("small", {className: "commit"}, change.comment)
			                      )
			                    )
			                  ), 
			                  React.createElement("div", {className: "col-md-3 text-right"}, 
			                    React.createElement("img", {src: "http://www.gravatar.com/avatar/{change.hash}?s=50"})
			                  )
			                )
			              )
			            )
			});
		return  React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-md-4 change"}, 
					changes
					)
				)
	}
});
