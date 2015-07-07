var Changes = React.createClass({displayName: "Changes",
	getInitialState: function() {
		return { changes: [] };
	},
	componentDidMount: function() {
		var _this = this;
		var url =  "/project/" + this.props.pipeline.name + "/pipelines/" + this.props.pipeline.id + "/changes"
		get(url, function(err, result) {
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
