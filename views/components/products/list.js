var isNode = typeof module !== 'undefined' && module.exports
var React = isNode ? require('react/addons') : window.React

if(isNode){
  var __ = require('underscore');
  var moment = require('moment');
  var DrawerMenu = require('../drawerMenu');
  var VerticalMenu = require('../verticalMenu');
  var HeaderContent = require('../headerContent');
  //var Path = require('./path');
  //var SidebarContent = require('./sidebar_content');
}
else{
  var __ = _;
  var socket;
}

moment.locale('zh-cn');

var i18n = {};
i18n['potential'] = "未进行";
i18n['active'] = "进行中";
i18n['completed'] = "已完成";
i18n['failed'] = "已失败";

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
          <span><a href='/en/dashboard/products'>产品</a></span>
          <span> > </span>
          <span>浏览</span>
        </div>
        <div className='row-nav-action'>
        </div>
      </div>
    )
  }
});

var ProductListHeader = React.createClass({
  render: function() {
    return (
      <div className='table-list-header flex-container-between'>
        <div className='table-list-header-toggle states left'>
        </div>
        <div className='table-list-header-toggle right'></div>
      </div>
    )
  }
});

var ProductListItem = React.createClass({
  render: function() {
    return (
      <li className="table-list-item flex-container-left">
      <span>this.props.title</span>
      </li>
    )
  }
});
//"2015年10月15日 GMT+8下午8:23"
var ProductList = React.createClass({
  getInitialState: function(){
    var products = this.props.products;
    var productItems = [];
    for(var i=0;i<products.length;i++){
      var item = React.createElement(ProductListItem, __.extend(products[i],{key:products[i].id,handleDelete:this.handleDelete.bind(this,products[i]._id)}));
      productItems.push(item);
    }
    return {
      items:productItems
    }
  },
  componentDidMount: function(){
    socket = io(window.location.host + "/product");
    socket.on('del',function(msg){
      if(!msg.err){
        window.location.reload();
      }
    })
  },
  componentWillUnmount: function() {
    socket.close();
  },
  handleDelete: function(_id,status){
    if (confirm('确定要删除吗？')) {
      console.log(_id);
      socket.emit('del',{_id:_id,status:status});
    } else {
        // Do nothing!
    }
  },
  render: function() {
    return (
      <ul className="table-list table-list-bordered table-list-tasks">
        {this.state.items}
      </ul>
    )
  }
});

var ProductBrowser = React.createClass({
  render: function() {
    return (
      <div className='flex-container-center task-browser'>
        <div className='subnav flex-container-right'>
          <a href='/en/dashboard/products/create' className='btn btn-primary right'>新产品</a>
        </div>
        <ProductListHeader counter={this.props.counter}/>
        <ProductList products={this.props.products}/>
      </div>
    )
  }
});

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
        <Path />
        <ProductBrowser products={props.products} counter={props.counter}/>
      </DrawerMenu>
    );
  }
});

//React.render(<App />, document.getElementById('example'))

if (isNode) {
  module.exports = App;
} else {
  React.render(<App />, document.getElementById('example'));
}
