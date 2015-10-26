'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var _material_title_panel = require('./material_title_panel');

var _material_title_panel2 = _interopRequireDefault(_material_title_panel);

var update = _reactAddons2['default'].addons.update;

var styles = {
  sidebar: {
    width: 256
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#757575',
    textDecoration: 'none'
  },
  divider: {
    margin: '8px 0',
    height: 1,
    backgroundColor: '#757575'
  }
};

var SidebarContent = _reactAddons2['default'].createClass({
  displayName: 'SidebarContent',

  render: function render() {
    var style = styles.sidebar;

    if (this.props.style) {
      style = update(style, { $merge: this.props.style });
    }

    var links = [];

    for (var i = 0; i < 10; i++) {
      links.push(_reactAddons2['default'].createElement(
        'a',
        { key: i, href: '#', style: styles.sidebarLink },
        'Mock menu item ',
        i
      ));
    }

    return _reactAddons2['default'].createElement(
      _material_title_panel2['default'],
      { title: 'Menu', style: style },
      _reactAddons2['default'].createElement(
        'a',
        { href: 'index.html', style: styles.sidebarLink },
        'Home'
      ),
      _reactAddons2['default'].createElement(
        'a',
        { href: 'responsive_example.html', style: styles.sidebarLink },
        'Responsive Example'
      ),
      _reactAddons2['default'].createElement('div', { style: styles.divider }),
      links
    );
  }
});

exports['default'] = SidebarContent;
module.exports = exports['default'];