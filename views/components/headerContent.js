var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react/addons') : window.React;

var names = ['home','users','tasks'];

var HeaderContent = React.createClass({
  render: function() {
    return (
      <div className='header-content'>
        <span></span>
        <div className='header-user'>
          <span>{this.props.user}</span>
          <span> </span>
          <a href='/user/logout'>登出</a>
        </div>
      </div>
    )
  }
});

if (isNode) {
  module.exports = HeaderContent;
}
