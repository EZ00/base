var isNode = typeof module !== 'undefined' && module.exports
var React = isNode ? require('react') : window.React;
var ReactDOM = isNode ? require('react-dom') : window.ReactDOM;

if(isNode){
  var moment = require('moment');
  var DrawerMenu = require('../drawerMenu');
  var VerticalMenu = require('../verticalMenu');
  var HeaderContent = require('../headerContent');
  var TagsInput = require('../tagsInput');
  //var Path = require('./path');
  //var SidebarContent = require('./sidebar_content');
}

moment.locale('zh-cn');
var i18n = {};
i18n['potential'] = "未进行";
i18n['active'] = "进行中";
i18n['completed'] = "已完成";
i18n['failed'] = "已失败";

var Path = React.createClass({
  render: function() {
    return (
      <div className="row-nav">
        <div className='row-nav-path'>
          <span><a href='/en/dashboard/tasks'>任务</a></span>
          <span> > </span>
          <span>查看</span>
        </div>
      </div>
    )
  }
});

var Panel = React.createClass({
  render: function() {
    var ass=[];
    for(var i=0;i<this.props.task.assignee.length;i++){
      ass.push(<div key={this.props.task.assignee[i]._id}>{this.props.task.assignee[i].username}</div>)
    }
    return(
      <div className='flex-container-center task-browser'>
        <div className='subnav flex-container-between' style={{flexWrap:'nowrap'}}>
          <div>
            <h1 className='header-title'>
              <span className='task-title'>
                {this.props.task.title}
              </span>
              <span className='header-number'>
                T{this.props.task.id}
              </span>
            </h1>
            <div className='header-meta' style={{marginTop:'5px'}}>
              <span className='state state-open'>{i18n[this.props.task.status]}</span>
              <span className='state priority'>{this.props.task.priority}</span>
              <span>
                <span className='author'>{this.props.task.editorName}</span>
                <span> 更新于</span>
                <time title={moment(this.props.task.timeModified).format('LLLL')} dateTime={this.props.task.timeModified} is="relative-time">{moment(this.props.task.timeModified).fromNow()}</time>
              </span>
            </div>
          </div>
          <div>
            <a href={'/en/dashboard/tasks/edit/'+this.props.task.id} className='btn right'>编辑</a>
            <a href='/en/dashboard/tasks/create' className='btn btn-primary right'>新任务</a>
          </div>
        </div>
        <div className='flex-container-between'>
          <div className='panel panel-default task-content'>
            <div className='panel-heading'>内容</div>
            <div className='panel-body' dangerouslySetInnerHTML={{__html: this.props.task.content}}></div>
          </div>
          <div className='panel panel-default'>
            <div className='panel-heading'>已分配给</div>
            <div className='panel-body'>
              {ass}
            </div>
          </div>
        </div>
      </div>
    )
  }
});

var App = React.createClass({
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
               headerContent={headerContent}>
        <Path />
        <Panel task={props.task}/>
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
