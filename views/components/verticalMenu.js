var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react/addons') : window.React;

var names = [
  {
    name:'首页',
    url:'/en/dashboard'
  },
  {
    name:'用户',
    url:'/en/dashboard/users'
  },
  {
    name:'任务',
    url:'/en/dashboard/tasks'
  }
];

var VerticalMenu = React.createClass({
  render: function() {
    return (
    <ul className='.vertical-menu-ul'>
    {
      names.map(function (name) {
        return <li key={name.name} className='vertical-menu-li'><a href={name.url} className='vertical-menu-a'>{name.name}</a></li>
      })
    }
    </ul>
    )
  }
});

if (isNode) {
  module.exports = VerticalMenu;
}
