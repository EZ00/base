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

var ImageItem = React.createClass({
  styles:{
    thumbnail: {
      display: 'block',
      padding: '4px',
      marginBottom: 0,
      lineHeight: 1.42857,
      backgroundColor: '#FFF',
      border: '1px solid #DDD',
      borderRadius: '4px',
      transition: 'border 0.2s ease-in-out 0s',
      width:'100px',
      height:'100px'
    }
  },
  getInitialState: function(){
    return {
      data_uri: this.props.data_uri,
    };
  },
  printProp:function(){
    console.log('imageItem:',this.props.data_uri);
  },
  changeDataUri:function(uri){
    console.log('changeDataUri:',uri);
    this.setState({data_uri:uri});
  },
  render: function() {
    return (
      <div className='image-item'>
        <img src={this.state.data_uri} alt="预览" style={this.styles.thumbnail} />
        <a className='btn-rm-image' onClick={this.props.handleDelete}>×</a>
      </div>
    )
  }
});

var ImageInput = React.createClass({
  getInitialState: function(){
    this.imgNumber = 6;
    var data_uris = [];
    for(var i=0;i<this.imgNumber;i++){
      data_uris.push(null);
    }
    return {
      data_uris: data_uris
    };
  },
  readURL: function(event){
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files);
        var self = this;
        var reader = new FileReader();
        var maxIndex = event.target.files.length-1;
        var uris = this.state.data_uris;
        var curIndex = 0;

        reader.onload = function (data) {
          console.log(data.target.result);
          uris[curIndex] = data.target.result;
          self.refs['preview'+curIndex].changeDataUri(uris[curIndex]);

          if(curIndex === maxIndex){
            console.log(uris);
            self.setState({
              data_uri: uris
            },function(){
              console.log('cb imageinput state:',self.state.data_uris);
            });
          }
          curIndex += 1;
        }
        for(var i=0;i<event.target.files.length;i++){
          reader.readAsDataURL(event.target.files[i]);
        }
    }
  },
  handleDelete: function(){

  },
  render: function() {
    var images = [];
    for(var i=0;i<this.imgNumber;i++){
      images.push(<ImageItem key={'preview'+i} ref={'preview'+i} data_uri={this.state.data_uris[i]} handleDelete={this.handleDelete.bind(this,i)}/>);
    }
    return (
      <div className="image-input">
        <input type='file' onChange={this.readURL} />
        <div style={{display:'flex',flexDirection:'row',flexWrap: 'wrap',justifyContent: 'flex-start',alignContent:'flex-start',alignItems:'flex-start'}}>
          {images}
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
            <ImageInput />
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
