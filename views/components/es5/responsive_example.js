'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sidebar = require('./sidebar');

var _sidebar2 = _interopRequireDefault(_sidebar);

var _material_title_panel = require('./material_title_panel');

var _material_title_panel2 = _interopRequireDefault(_material_title_panel);

var _sidebar_content = require('./sidebar_content');

var _sidebar_content2 = _interopRequireDefault(_sidebar_content);

var styles = {
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white',
    padding: 8
  }
};

var App = _react2['default'].createClass({
  displayName: 'App',

  getInitialState: function getInitialState() {
    return { docked: false, open: false };
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
  },

  toggleOpen: function toggleOpen(ev) {
    this.setState({ open: !this.state.open });

    if (ev) {
      ev.preventDefault();
    }
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
    var sidebar = _react2['default'].createElement(_sidebar_content2['default'], null);

    var contentHeader = _react2['default'].createElement(
      'span',
      null,
      !this.state.docked && _react2['default'].createElement(
        'a',
        { onClick: this.toggleOpen, href: '#', style: styles.contentHeaderMenuLink },
        '='
      ),
      _react2['default'].createElement(
        'span',
        null,
        ' Responsive React Sidebar'
      )
    );

    var sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      open: this.state.open,
      onSetOpen: this.onSetOpen
    };

    return _react2['default'].createElement(
      _sidebar2['default'],
      sidebarProps,
      _react2['default'].createElement(
        _material_title_panel2['default'],
        { title: contentHeader },
        _react2['default'].createElement(
          'p',
          null,
          'This example will automatically dock the sidebar if the page width is above 800px (which is currently ',
          '' + this.state.docked,
          ').'
        ),
        _react2['default'].createElement(
          'p',
          null,
          'This functionality should live in the component that renders the sidebar. This way you\'re able to modify the sidebar and main content based on the responsiveness data. For example, the menu button in the header of the content is now ',
          this.state.docked ? 'hidden' : 'shown',
          ' because the sidebar is ',
          !this.state.docked && 'not',
          ' visible.'
        )
      )
    );
  }
});

module.exports = App;
//_react2['default'].render(_react2['default'].createElement(App, null), document.getElementById('example'));
