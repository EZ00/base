var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react/addons') : window.React;

var Path = React.createClass({
  render: function() {
    if(isNode){
      var props = this.props;
    }
    else {
      var props = window.REACT_PROPS;
    }
    return (
      <div className="row-nav">
        <div className='row-nav-path'>
          <span>tasks</span>
          <span> > </span>
          <span>all</span>
        </div>
        <div className='row-nav-action'>
          <span>create</span>
        </div>
      </div>
    )
  }
});

if (isNode) {
  module.exports = Path;
}
