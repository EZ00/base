var isNode = typeof module !== 'undefined' && module.exports
var React = isNode ? require('react/addons') : window.React

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
          <span><a href='/en/dashboard/products'>产品</a></span>
          <span> > </span>
          <span>创建</span>
        </div>
      </div>
    )
  }
});

var ImageInput = React.createClass({
  getInitialState: function(){
    return {
      data_uri: null,
    };
  },
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
          <span>创建</span>
        </div>
      </div>
    )
  }
});

var Panel = React.createClass({
  getInitialState: function(){
    return {
      data_uri: null,
    };
  },
  componentDidMount: function(){
    socket = io(window.location.host + "/product");
    // socket.emit('hello',{msg:'hello socket'});
    socket.on('create',function(data){
      if(data.err){
        alert(data.err);
      }
      else{
        window.location = "/en/dashboard/products/p/"+data.id;
      }
    })
  },
  componentWillUnmount: function() {
    socket.close();
  },
  handleSubmit: function(){
    var data = {
      title:this.refs.title.getDOMNode().value,
      content:this.refs.content.getDOMNode().value,
      status:this.refs.display.getDOMNode().value,
      priority:Number(this.refs.priority.getDOMNode().value),
      assignee:this.refs.assignee.tags
    }
    if(data.title===''){
      alert('请填写标题！')
      return null;
    }
    if(data.content===''){
      alert('请填写内容！')
      return null;
    }
    console.log(data);
    socket.emit('create',data);
  },
  readURL: function(event){
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files);
        var self = this;
        var reader = new FileReader();

        reader.onload = function (upload) {
          console.log(upload.target.result);
          self.setState({
            data_uri: upload.target.result,
          });
        }

        reader.readAsDataURL(event.target.files[0]);
    }
  },
  render: function() {
    return(
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">创建新产品</h3>
        </div>
        <div className="panel-body">
          <div className='form-group'>
              <input className='form-control' type='text' placeholder='标题' ref='title'></input>
          </div>
          <div className='form-group'>
            <input type='file' id="imgInp" onChange={this.readURL} />
            <img id="blah" src={this.state.data_uri} alt="your image" style={{width:'100px',height:'100px'}} />
            <img id="blah" src={this.state.data_uri} alt="your image" style={{width:'100px',height:'100px'}} />
            <img id="blah" src={this.state.data_uri} alt="your image" style={{width:'100px',height:'100px'}} />
            <img id="blah" src={this.state.data_uri} alt="your image" style={{width:'100px',height:'100px'}} />
            <img id="blah" src={this.state.data_uri} alt="your image" style={{width:'100px',height:'100px'}} />
            <img id="blah" src={this.state.data_uri} alt="your image" style={{width:'100px',height:'100px'}} />
          </div>
          <div className='form-group'>
              <textarea className="form-control" rows="8" placeholder='内容' ref='content'></textarea>
          </div>
          <div className='form-group'>
            <label>是否展示</label>
            <select className="form-control" ref='display'>
              <option value='true'>展示</option>
              <option value='false'>不展示</option>
            </select>
          </div>
          <div className='form-group'>
            <label>优先级（选填）</label>
            <input className='form-control' type='number' placeholder='请填写数字' ref='priority'></input>
          </div>
          <div className='form-group'>
            <label>分配给（选填）</label>
            <TagsInput placeholder='输入名字，按回车添加' tags={tags} source='/en/dashboard/users/all' ref='assignee'/>
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
        <Panel/>
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
