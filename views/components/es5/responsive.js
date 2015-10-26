'use strict';

var React = require('react');
var Sidebar = require('./sidebar');

var App = React.createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
    return { docked: false, open: false };
  },

  onSetOpen: function onSetOpen(open) {
    this.setState({ open: open });
  },

  componentDidMount: function componentDidMount() {
    var mql = window.matchMedia('(min-width: 800px)');
    mql.addListener(this.mediaQueryChanged);
    this.setState({ mql: mql, docked: mql.matches });
  },

  componentWillUnmount: function componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  },

  mediaQueryChanged: function mediaQueryChanged() {
    this.setState({ docked: this.state.mql.matches });
  },

  render: function render() {
    var sidebarContent = React.createElement(
      'b',
      null,
      'Sidebar content'
    );

    return React.createElement(
      Sidebar,
      { sidebar: sidebarContent,
        open: this.state.open,
        docked: this.state.docked,
        onSetOpen: this.onSetOpen },
      React.createElement(
        'b',
        null,
        'Main content'
      )
    );
  }
});

//React.render(React.createElement(App, null), document.getElementById('example'));

module.exports = App;
