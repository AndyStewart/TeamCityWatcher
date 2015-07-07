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

var Changes = React.createClass({
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
				return <div className="row">
			              <div className="col-md-12 info">
			                <div className="row">
			                  <div className="col-md-9">
			                    <div className="row">
			                      <div className="col-md-12">
			                        <strong className="username">{change.username}</strong>
			                      </div>
			                    </div>
			                    <div className="row">
			                      <div className="col-md-12">
			                        <small className="commit">{change.comment}</small>
			                      </div>
			                    </div>
			                  </div>
			                  <div className="col-md-3 text-right">
			                    <img src="http://www.gravatar.com/avatar/{change.hash}?s=50" />
			                  </div>
			                </div>
			              </div>
			            </div>
			});
		return  <div className="row">
					<div className="col-md-4 change">
					{changes}
					</div>
				</div>
	}
});
