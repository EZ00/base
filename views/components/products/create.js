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
else{

}
var socketCategory;
function sha256(buffer) {
  return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
      //console.log(hash);
    return hex(hash);
  });
}

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i)
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16)
    //console.log(stringValue)
    // We use concatenation and slice for padding
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  return hexCodes.join("");
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
    },
    btnRmImage:{
      cursor:'pointer',
    }
  },
  getInitialState: function(){
    this.name = null;
    this.size = null;
    this.type = null;
    this.buffer = null;
    this.sha256 = null;
    return {
      data_uri: this.props.data_uri,
    };
  },
  printProp:function(){
    console.log('imageItem:',this.props.data_uri);
  },
  changeMeta:function(name,size,type){
    this.name = name;
    this.size = size;
    this.type = type;
  },
  changeDataUri:function(uri){
    //console.log('changeDataUri:',uri);
    this.setState({data_uri:uri});
  },
  changeBuffer:function(buffer){
    this.buffer = buffer;
  },
  changeSha256:function(sha256){
    console.log('changeSha256:',sha256);
    this.sha256 = sha256;
  },
  handleDelete:function(){
    this.name = null;
    this.size = null;
    this.type = null;
    this.buffer = null;
    this.sha256 = null;
    this.setState({data_uri:null});
  },
  render: function() {
    return (
      <div className='image-item'>
        <img src={this.state.data_uri} alt="预览" style={this.styles.thumbnail} />
        <a onClick={this.handleDelete} style={this.styles.btnRmImage}>删除</a>
      </div>
    )
  }
});

var ImageInput = React.createClass({
  getInitialState: function(){
    this.imgNumber = 6;
    this.data_uris = [];
    for(var i=0;i<this.imgNumber;i++){
      this.data_uris.push(null);
    }
    // return {
    //   data_uris: data_uris
    // };
    return null;
  },
  readURL: function(event){
    //console.log(event);
    if (event.target.files && event.target.files[0]) {
      if(event.target.files.length > 6){
        event.preventDefault();
        alert('最多可选6张图片！')
        return;
      }
      //  console.log(event.target.files);
        var self = this;
        var files = event.target.files;
        var reader = new FileReader();
        var readerBuffer = new FileReader();
        var maxIndex = event.target.files.length-1;
        //var uris = this.state.data_uris;
        var curIndex = 0;
        var bufIndex = 0;

        reader.onload = function (data) {
          //console.log(data.target.result);
          //uris[curIndex] = data.target.result;
          self.refs['preview'+curIndex].changeDataUri(data.target.result);
          curIndex += 1;
          if(curIndex < files.length){
            reader.readAsDataURL(files[curIndex]);
          }

          // if(curIndex === maxIndex){
          //   console.log(uris);
          //   self.setState({
          //     data_uri: uris
          //   },function(){
          //     console.log('cb imageinput state:',self.state.data_uris);
          //   });
          // }
        }
        readerBuffer.onloadend = function(evnt){
            if (evnt.target.readyState == FileReader.DONE) { // DONE == 2
              self.refs['preview'+bufIndex].changeBuffer(evnt.target.result);
              sha256(evnt.target.result).then(function(digest){
                //console.log('index:',this.index);
                //console.log(digest);
                self.refs['preview'+this.index].changeSha256(digest);
              }.bind({index:bufIndex}))
              bufIndex += 1;
              if(bufIndex < files.length){
                readerBuffer.readAsArrayBuffer(files[bufIndex]);
              }
            }
        }
        reader.readAsDataURL(event.target.files[curIndex]);
        readerBuffer.readAsArrayBuffer(event.target.files[bufIndex]);
        // changeMeta
        for(var i=0;i<event.target.files.length;i++){
          var file = event.target.files[i];
          self.refs['preview'+i].changeMeta(file.name,file.size,file.type);
        }
    }
  },
  handleDelete: function(){

  },
  getfiles: function(){
    var files = [];
    for(var i=0;i<this.imgNumber;i++){
      if(this.refs['preview'+i].buffer !== null && this.refs['preview'+i].sha256 !== null){
        var file = {};
        file.name = this.refs['preview'+i].name.split('.')[0];
        file.ext = this.refs['preview'+i].name.split('.')[1].toLowerCase();
        file.size = this.refs['preview'+i].size;
        file.type = this.refs['preview'+i].type;
        file.buffer = this.refs['preview'+i].buffer;
        file.sha256 = this.refs['preview'+i].sha256;
        files.push(file);
      }
    }
    return files;
  },
  render: function() {
    var images = [];
    for(var i=0;i<this.imgNumber;i++){
      images.push(<ImageItem key={'preview'+i} ref={'preview'+i} data_uri={this.data_uris[i]} handleDelete={this.handleDelete.bind(this,i)}/>);
    }
    return (
      <div className="image-input">
        <input type='file' multiple accept="image/*" onChange={this.readURL} />
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
      maxLevel: 0,
      categories:[],
      data_uri: null,
    };
  },
  componentDidMount: function(){
    socket = io(window.location.host + "/product");
    socketCategory = io(window.location.host + "/category");
    socketCategory.emit('findFirstLevels');
    socketCategory.on('findFirstLevels',function(data){
      console.log('findFirstLevels',data);
    })
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
      files:this.refs.imageInput.getfiles(),
      // title:this.refs.title.getDOMNode().value,
      // content:this.refs.content.getDOMNode().value,
      // status:this.refs.display.getDOMNode().value,
      // priority:Number(this.refs.priority.getDOMNode().value),
      // assignee:this.refs.assignee.tags
    }
    // if(data.title===''){
    //   alert('请填写标题！')
    //   return null;
    // }
    // if(data.content===''){
    //   alert('请填写内容！')
    //   return null;
    // }
    console.log(data);
    socket.emit('create',data);
  },
  createCategory: function(){
    console.log('Enter createCategory');
    var name = this.refs.categoryName.getDOMNode().value;
    console.log(name);
    this.refs.categoryName.getDOMNode().value = '';
  },
  handleCategoryKeyPress: function(e){
    if(e.key === 'Enter'){
      this.createCategory();
    }
  },
  render: function() {
    return(
      <div>
        <ul className="nav nav-tabs" role="tablist">
          <li role="presentation"><a href="#category" aria-controls="category" role="tab" data-toggle="tab">选择类目</a></li>
          <li role="presentation"><a href="#props" aria-controls="props" role="tab" data-toggle="tab">产品属性</a></li>
          <li role="presentation" className="active"><a href="#productMain" aria-controls="productMain" role="tab" data-toggle="tab">主要信息</a></li>
        </ul>
        <div className="tab-content">
          <div className="panel panel-default tab-pane active" role="tabpanel" id="productMain">
            <div className="panel-heading">
              <h3 className="panel-title">创建新产品</h3>
            </div>
            <div className="panel-body">
              <div className='form-group'>
                  <input className='form-control' type='text' placeholder='标题' ref='title'></input>
              </div>
              <div className='form-group'>
                <ImageInput ref='imageInput'/>
              </div>
              <div className='form-group'>
                <label>是否展示</label>
                <select className="form-control" ref='display'>
                  <option value='true'>展示</option>
                  <option value='false'>不展示</option>
                </select>
              </div>
              <div className='form-group'>
                <label>价格</label>
                <div className='form-inline'>
                  <select className="form-control" ref='currency'>
                    <option value='USD'>USD</option>
                    <option value='RMB'>RMB</option>
                  </select>
                  <input className='form-control' type='number' placeholder='请填写数字' ref='priceMin'></input>
                  <span> - </span>
                  <input className='form-control' type='number' placeholder='请填写数字' ref='priceMax'></input>
                  <span> / </span>
                  <select className="form-control" ref='priceUnit'>
                    <option value='ton/tons'>吨</option>
                    <option value='piece/pieces'>件</option>
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <label>最小起订量</label>
                <div className='form-inline'>
                  <input className='form-control' type='number' placeholder='请填写数字' ref='moq'></input>
                  <select className="form-control" ref='moqUnit'>
                    <option value='ton/tons'>吨</option>
                    <option value='piece/pieces'>件</option>
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <label>供货能力</label>
                <div className='form-inline'>
                  <input className='form-control' type='number' placeholder='请填写数字' ref='supplyQuantity'></input>
                  <select className="form-control" ref='supplyUnit'>
                    <option value='ton/tons'>吨</option>
                    <option value='piece/pieces'>件</option>
                  </select>
                  <span> / </span>
                  <select className="form-control" ref='supplyPeriod'>
                    <option value='month'>月</option>
                    <option value='year'>年</option>
                    <option value='day'>天</option>
                  </select>
                </div>
              </div>
              <div className='form-group'>
                <label>发货期限</label>
                <input className='form-control' type='text' placeholder='' ref='consignmentTerm'></input>
              </div>
              <div className='form-group'>
                <label>详细描述</label>
                <textarea className="form-control" rows="8" placeholder='内容' ref='content'></textarea>
              </div>
              <div className='form-group form-confirm-container'>
                <button className="btn btn-default form-confirm-item" type="submit" onClick={this.handleSubmit}>确定</button>
                <a className="btn btn-danger form-confirm-item" href="/en/dashboard/tasks" role="button">取消</a>
              </div>
            </div>
          </div>
          <div role="tabpanel" className="tab-pane" id="category">
            <div className='form-inline' style={{margin:'10px'}}>
              <select>
                <option value="child">子类目</option>
                <option value="sibling">同级类目</option>
                <option value="parent">上级类目</option>
              </select>
              <input type='text' ref='categoryName' onKeyPress={this.handleCategoryKeyPress}/>
              <button onClick={this.createCategory}>创建</button>
            </div>
            <div ref='selected' style={{margin:'10px'}}></div>
            <div style={{margin:'10px'}}>
              <select name="select" multiple>
                <option value="value1">Value 1</option>
                <option value="value2" defaultValue>Value 2</option>
                <option value="value3">Value 3</option>
              </select>
              <select name="select" multiple>
                <option value="value1">Value 1</option>
                <option value="value2" defaultValue>Value 2</option>
                <option value="value3">Value 3</option>
              </select>
            </div>
          </div>
          <div role="tabpanel" className="tab-pane" id="props">...</div>
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
