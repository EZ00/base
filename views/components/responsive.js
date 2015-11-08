var isNode = typeof module !== 'undefined' && module.exports
var React = isNode ? require('react') : window.React;
var ReactDOM = isNode ? require('react-dom') : window.ReactDOM;

if(isNode){
  var DrawerMenu = require('./drawerMenu');
  var VerticalMenu = require('./verticalMenu');
  var HeaderContent = require('./headerContent');
  //var SidebarContent = require('./sidebar_content');
}

var App = React.createClass({
  getInitialState() {
    return {docked: false, open: false};
  },

  onSetOpen: function(open) {
    this.setState({open: open});
  },

  componentDidMount: function() {
    var mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, docked: mql.matches});
  },

  componentWillUnmount: function() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  },

  mediaQueryChanged: function() {
    this.setState({docked: this.state.mql.matches});
  },

  render: function() {
    if(isNode){
      var props = this.props;
    }
    else {
      var props = window.REACT_PROPS;
    }
    var drawerContent = <VerticalMenu />;
    var headerContent = <HeaderContent user={props.user} />;

    return (
      <DrawerMenu drawerContent={drawerContent}
               headerContent={headerContent}
               docked={this.state.docked}
               onSetOpen={this.onSetOpen}>
        <b>Main content</b>
      </DrawerMenu>
    );
  }
});

//ReactDOM.render(<App />, document.getElementById('example'))

if (isNode) {
  module.exports = App;
} else {
  ReactDOM.render(<App />, document.getElementById('example'));
}
