'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var update = _reactAddons2['default'].addons.update;

var styles = {
  root: {
    fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
    fontWeight: 300
  },
  header: {
    backgroundColor: '#03a9f4',
    color: 'white',
    padding: '16px',
    fontSize: '1.5em'
  },
  content: {
    padding: '16px'
  }
};

var MaterialTitlePanel = (function (_React$Component) {
  _inherits(MaterialTitlePanel, _React$Component);

  function MaterialTitlePanel() {
    _classCallCheck(this, MaterialTitlePanel);

    _get(Object.getPrototypeOf(MaterialTitlePanel.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(MaterialTitlePanel, [{
    key: 'render',
    value: function render() {
      var rootStyle = this.props.style ? update(styles.root, { $merge: this.props.style }) : styles.root;

      return _reactAddons2['default'].createElement(
        'div',
        { style: rootStyle },
        _reactAddons2['default'].createElement(
          'div',
          { style: styles.header },
          this.props.title
        ),
        _reactAddons2['default'].createElement(
          'div',
          { style: styles.content },
          this.props.children
        )
      );
    }
  }]);

  return MaterialTitlePanel;
})(_reactAddons2['default'].Component);

exports['default'] = MaterialTitlePanel;
module.exports = exports['default'];