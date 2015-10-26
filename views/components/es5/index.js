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
    return {
      docked: false,
      open: false,
      transitions: true,
      touch: true,
      shadow: true,
      pullRight: false,
      touchHandleWidth: 20,
      dragToggleDistance: 30
    };
  },

  onSetOpen: function onSetOpen(open) {
    this.setState({ open: open });
  },

  menuButtonClick: function menuButtonClick(ev) {
    ev.preventDefault();
    this.onSetOpen(!this.state.open);
  },

  renderPropCheckbox: function renderPropCheckbox(prop) {
    var _this = this;

    var toggleMethod = function toggleMethod(ev) {
      var newState = {};
      newState[prop] = ev.target.checked;
      _this.setState(newState);
    };

    return _react2['default'].createElement(
      'p',
      { key: prop },
      _react2['default'].createElement('input', { type: 'checkbox', onChange: toggleMethod, checked: this.state[prop], id: prop }),
      _react2['default'].createElement(
        'label',
        { htmlFor: prop },
        ' ',
        prop
      )
    );
  },

  renderPropNumber: function renderPropNumber(prop) {
    var _this2 = this;

    var setMethod = function setMethod(ev) {
      var newState = {};
      newState[prop] = parseInt(ev.target.value);
      _this2.setState(newState);
    };

    return _react2['default'].createElement(
      'p',
      { key: prop },
      prop,
      ' ',
      _react2['default'].createElement('input', { type: 'number', onChange: setMethod, value: this.state[prop] })
    );
  },

  render: function render() {
    var sidebar = _react2['default'].createElement(_sidebar_content2['default'], null);

    var contentHeader = _react2['default'].createElement(
      'span',
      null,
      !this.state.docked && _react2['default'].createElement(
        'a',
        { onClick: this.menuButtonClick, href: '#', style: styles.contentHeaderMenuLink },
        '='
      ),
      _react2['default'].createElement(
        'span',
        null,
        ' React Sidebar'
      )
    );

    var sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      open: this.state.open,
      touch: this.state.touch,
      shadow: this.state.shadow,
      pullRight: this.state.pullRight,
      touchHandleWidth: this.state.touchHandleWidth,
      dragToggleDistance: this.state.dragToggleDistance,
      transitions: this.state.transitions,
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
          'React Sidebar is a sidebar component for React. It offers the following features:'
        ),
        _react2['default'].createElement(
          'ul',
          null,
          _react2['default'].createElement(
            'li',
            null,
            'Have the sidebar slide over main content'
          ),
          _react2['default'].createElement(
            'li',
            null,
            'Dock the sidebar next to the content'
          ),
          _react2['default'].createElement(
            'li',
            null,
            'Touch enabled: swipe to open and close the sidebar'
          ),
          _react2['default'].createElement(
            'li',
            null,
            'Easy to combine with media queries for auto-docking (',
            _react2['default'].createElement(
              'a',
              { href: 'responsive_example.html' },
              'see example'
            ),
            ')'
          ),
          _react2['default'].createElement(
            'li',
            null,
            'Sidebar and content passed in as PORCs (Plain Old React Components)'
          ),
          _react2['default'].createElement(
            'li',
            null,
            _react2['default'].createElement(
              'a',
              { href: 'https://github.com/balloob/react-sidebar' },
              'Source on GitHub'
            ),
            ' (MIT license)'
          ),
          _react2['default'].createElement(
            'li',
            null,
            'Only dependency is React'
          )
        ),
        _react2['default'].createElement(
          'p',
          null,
          _react2['default'].createElement(
            'a',
            { href: 'https://github.com/balloob/react-sidebar#installation' },
            'Instructions how to get started.'
          )
        ),
        _react2['default'].createElement(
          'p',
          null,
          _react2['default'].createElement(
            'b',
            null,
            'Current rendered sidebar properties:'
          )
        ),
        ['open', 'docked', 'transitions', 'touch', 'shadow', 'pullRight'].map(this.renderPropCheckbox),
        ['touchHandleWidth', 'dragToggleDistance'].map(this.renderPropNumber)
      )
    );
  }
});

module.exports = App;
//_react2['default'].render(_react2['default'].createElement(App, null), document.getElementById('example'));