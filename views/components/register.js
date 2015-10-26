var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react/addons') : window.React;

var Register = React.createClass({
  render: function() {
    if(isNode){
      var props = this.props;
    }
    else {
      var props = window.REACT_PROPS;
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-md-4 col-md-offset-4">
            <h1 className="text-center login-title">Registration Details</h1>
              <div className="signup-wall">
                <form action="/user/root" method="POST" className="form-signin">
                  <input type="text" name="username" placeholder="Username" required="required" autofocus="autofocus" className="form-control"/>
                  <input type="password" name="password" placeholder="Password" required="required" className="form-control nomargin"/>
                  <button type="submit" className="btn btn-lg btn-primary btn-block">Register</button><span className="clearfix"></span>
                </form>
              </div>
              <div id="message">{props.message}</div>
          </div>
        </div>
      </div>
    )
  }
});

if (isNode) {
  module.exports = Register;
}
