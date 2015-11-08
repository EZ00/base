var isNode = typeof module !== 'undefined' && module.exports
var React = isNode ? require('react') : window.React;
var ReactDOM = isNode ? require('react-dom') : window.ReactDOM;

if(isNode){
  var DrawerMenu = require('../drawerMenu');
  var VerticalMenu = require('../verticalMenu');
  var HeaderContent = require('../headerContent');
  var TagsInput = require('../tagsInput');
  //var Path = require('./path');
  //var SidebarContent = require('./sidebar_content');
}

var socket;
var tags = [
  // 'tag a',
  // 'tag b',
  // 'tag c'
];

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
          <span>编辑</span>
        </div>
      </div>
    )
  }
});

var Panel = React.createClass({
  componentDidMount: function(){
    this.refs[this.props.task.status].getDOMNode().selected='selected';
    socket = io(window.location.host + "/task");
    // socket.emit('hello',{msg:'hello socket'});
    socket.on('edit',function(data){
      if(data.err){
        alert(data.err);
      }
      else{
        window.location = "/en/dashboard/tasks/t/"+data.id;
      }
    })
  },
  componentWillUnmount: function() {
    socket.close();
  },
  handleSubmit: function(){
    var doc = {
      title:this.refs.title.getDOMNode().value,
      content:this.refs.content.getDOMNode().value,
      status:this.refs.status.getDOMNode().value,
      priority:Number(this.refs.priority.getDOMNode().value),
      assignee:this.refs.assignee.tags
    }
    if(doc.title===''){
      alert('请填写标题！')
      return null;
    }
    if(doc.content===''){
      alert('请填写内容！')
      return null;
    }
    var data={};
    data.doc = doc;
    data.oldStatus = this.props.task.status;
    data.id = this.props.task.id;
    console.log(data);
    socket.emit('edit',data);
  },
  render: function() {
    // console.log('render edit panel')
    var task = this.props.task;
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">创建新任务</h3>
        </div>
        <div className="panel-body">
          <div className='form-group'>
              <input className='form-control' type='text' placeholder='标题' ref='title' defaultValue={task.title}></input>
          </div>
          <div className='form-group'>
              <textarea className="form-control" rows="8" placeholder='内容' ref='content' defaultValue={task.content}></textarea>
          </div>
          <div className='form-group'>
            <label>状态</label>
            <select className="form-control" ref='status'>
              <option value='potential' ref='potential'>未进行</option>
              <option value='active' ref='active'>进行中</option>
              <option value='completed' ref='completed'>已完成</option>
              <option value='failed' ref='failed'>已失败</option>
            </select>
          </div>
          <div className='form-group'>
            <label>优先级（选填）</label>
            <input className='form-control' type='number' placeholder='请填写数字' ref='priority' defaultValue={task.priority}></input>
          </div>
          <div className='form-group'>
            <label>分配给（选填）</label>
            <TagsInput placeholder='输入名字，按回车添加' tags={task.assignee} source='/en/dashboard/users/all' ref='assignee'/>
          </div>
          <div className='form-group form-confirm-container'>
            <button className="btn btn-default form-confirm-item" type="submit" onClick={this.handleSubmit}>确定</button>
            <a className="btn btn-danger form-confirm-item" href="/en/dashboard/tasks" role="button">取消</a>
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
