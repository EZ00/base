var isNode = typeof module !== 'undefined' && module.exports
var React = isNode ? require('react/addons') : window.React

if(isNode){
  var __ = require('underscore');
  var moment = require('moment');
  var DrawerMenu = require('./drawerMenu');
  var VerticalMenu = require('./verticalMenu');
  var HeaderContent = require('./headerContent');
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
          <span><a href='/en/dashboard/tasks'>任务</a></span>
          <span> > </span>
          <span>浏览</span>
        </div>
        <div className='row-nav-action'>
        </div>
      </div>
    )
  }
});

var TaskListHeader = React.createClass({
  render: function() {
    return (
      <div className='table-list-header flex-container-between'>
        <div className='table-list-header-toggle states left'>
          <span>进行中:{this.props.counts.active||0} </span>
          <span>未进行:{this.props.counts.potential||0} </span>
          <span>已完成:{this.props.counts.completed||0} </span>
          <span>已失败:{this.props.counts.failed||0} </span>
        </div>
        <div className='table-list-header-toggle right'></div>
      </div>
    )
  }
});

var TaskListItem = React.createClass({
  render: function() {
    return (
      <li className="table-list-item flex-container-left">
        <div className='task-status' style={{alignSelf:'center'}}>
          <span className='priority'>{this.props.priority}</span>
          <span>{i18n[this.props.status]}</span>
        </div>
        <div>
          <a href={"/en/dashboard/tasks/t/"+this.props.id} className="task-title-link">
            {this.props.title}
          </a>
          <div className="task-meta">
            <span className="task-meta-section opened-by">
              <span>T{this.props.id} </span>
              更新于
              <time title={moment(this.props.timeModified).format("YYYY年MM月DD日 a hh:mm:ss")} dateTime={this.props.timeModified} is="relative-time">{moment(this.props.timeModified).fromNow()}</time>
              <span> 由 </span>
              <a aria-label="View all tasks opened by mrinal013" className="tooltipped tooltipped-s muted-link">{this.props.editorName}</a>
            </span>
          </div>
        </div>
        <div className="flex-container-right" style={{flexGrow:1,alignSelf:'center'}}>
          <button className="btn btn-danger" style={{marginRight:"2px"}} onClick={this.props.handleDelete}>删除</button>
        </div>
      </li>
    )
  }
});
//"2015年10月15日 GMT+8下午8:23"
var TaskList = React.createClass({
  getInitialState: function(){
    var tasks = this.props.tasks;
    var taskItems = [];
    for(var i=0;i<tasks.length;i++){
      var item = React.createElement(TaskListItem, __.extend(tasks[i],{key:tasks[i].id,handleDelete:this.handleDelete.bind(this,tasks[i]._id,tasks[i].status)}));
      taskItems.push(item);
    }
    return {
      items:taskItems
    }
  },
  componentDidMount: function(){
    socket = io(window.location.host + "/task");
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

var TaskBrowser = React.createClass({
  render: function() {
    return (
      <div className='flex-container-center task-browser'>
        <div className='subnav flex-container-right'>
          <a href='/en/dashboard/tasks/create' className='btn btn-primary right'>新任务</a>
        </div>
        <TaskListHeader counts={this.props.counts}/>
        <TaskList tasks={this.props.tasks}/>
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
        <TaskBrowser tasks={props.tasks} counts={props.counts}/>
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
