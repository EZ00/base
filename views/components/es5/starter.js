'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sidebar = require('./sidebar');

var _sidebar2 = _interopRequireDefault(_sidebar);

var App = _react2['default'].createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
    return {
      sidebarOpen: false,
      sidebarDocked: true
    };
  },

  onSetSidebarOpen: function onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  },

  render: function render() {
    var sidebarContent = _react2['default'].createElement(
      'b',
      null,
      'Sidebar content'
    );

    return _react2['default'].createElement(
      _sidebar2['default'],
      { sidebar: sidebarContent,
        open: this.state.sidebarOpen,
        docked: this.state.sidebarDocked,
        onSetOpen: this.onSetSidebarOpen },
      _react2['default'].createElement(
        'b',
        null,
        'Main content'
      )
    );
  }
});

_react2['default'].render(_react2['default'].createElement(App, null), document.getElementById('example'));

module.exports = App;