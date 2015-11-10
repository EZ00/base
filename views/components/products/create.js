var isNode = typeof module !== 'undefined' && module.exports

if(isNode){
  var React = require('react')
  var ReactDOM = require('react-dom');
  var DrawerMenu = require('../drawerMenu');
  var VerticalMenu = require('../verticalMenu');
  var HeaderContent = require('../headerContent');
  var TagsInput = require('../tagsInput');
  //var Path = require('./path');
  //var SidebarContent = require('./sidebar_content');
}
else{
  var React = window.React;
  var ReactDOM = window.ReactDOM;
  var socket;
  var socketCategory;
  // Return an array of the selected opion values
  // select is an HTML select element
  var getSelectValues = function(select) {
    var result = [];
    var options = select && select.options;
    var opt;

    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];

      if (opt.selected) {
        result.push({
          _id:(opt.value || opt.text),
          children:opt.dataset.children?opt.dataset.children.split(","):[],
          parents:opt.dataset.parents?opt.dataset.parents.split(","):[],
          level:Number(opt.dataset.level),
          number:Number(opt.dataset.number),
          name:opt.dataset.name,
        });
      }
    }
    return result;
  }

  var hex = function(buffer) {
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
  var sha256 = function(buffer) {
    return crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
        //console.log(hash);
      return hex(hash);
    });
  }
}

var tags = [
  // 'tag a',
  // 'tag b',
  // 'tag c'
];

var db = {};

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

var SelectCategory = React.createClass({
  getInitialState: function(){
    this.inited = false;
    this.maxLevel = 1;
    return {
      selected: []
    };
  },
  componentDidMount: function(){
    socketCategory = io(window.location.host + "/category");
    socketCategory.emit('findAll');
    socketCategory.on('findAll',function(data){
      console.log('findAll',data);
      db.categories.init(data.docs);
      this.inited=true;
      this.forceUpdate();
    }.bind(this))
    socketCategory.on("create",function(data){
      console.log("Enter on create")
      console.log(data);
      var categories = this.state.categories;
      categories.push(data.doc);
      this.setState({categories:categories});
      console.log("Leave on create")
    }.bind(this))
    socketCategory.on("set",function(docs){
      console.log("Enter on create")
      console.log(data);
      var categories = this.state.categories;
      for(var i=0;i<docs.length;i++){
        for(var j=0;j<categories.length;j++){

        }
      }
      this.setState({categories:categories});
      console.log("Leave on create")
    }.bind(this))
    socketCategory.on("remove",function(data){
      console.log("Enter on remove")
      console.log(data);
      var categories = this.state.categories;
      var selected = this.state.selected;
      var parentsCount = 0;
      var childRmed = false;
      for(var i=0;i<categories.length;i++){
        if(categories[i]._id === data._id){
          categories.splice(i,1);
          i -= 1;
          childRmed = true;
        }
        if(data.parents.indexOf(categories[i]._id) > -1){
          for(var j=0;j<categories[i].children.length;j++){
            if(categories[i].children[j] === data._id){
              categories[i].children.splice(j,1);
              j -= 1;
            }
          }
          parentsCount += 1;
        }
        if(childRmed && parentsCount===data.parents.length){
          break;
        }
      }
      for(var i=0;i<selected.length;i++){
        for(var j=0;j<selected[i].length;j++){
          if(selected[i][j]._id === data._id){
            selected[i].splice(j,1);
            j -= 1;
          }
        }
      }
      this.setState({categories:categories,selected:selected});
      console.log("Leave on remove")
    }.bind(this))
  },
  componentWillUnmount: function() {
    socketCategory.close();
  },
  createCategory: function(){
    console.log('Enter createCategory');
    var categories = this.state.categories;
    var selected = null;
    if(this.state.selected.length > 0){
      selected = this.state.selected[this.state.selected.length-1];
    }
    var newCate = {};
    newCate.name = this.refs.categoryName.getDOMNode().value.trim();
    this.refs.categoryName.getDOMNode().value = '';
    if(newCate.name === ''){
      alert('类目名不能为空！');
    }
    else{
      if(categories.length===0){
        newCate.level = 1;
        newCate.parents = [];
        newCate.children = [];
        socketCategory.emit('insert',{doc:newCate});
      }
      else if(selected !== null){
        console.log("selected !== null");
        //var maxLevel = this.state.selects.length;
        //var selected = [{_id:1,level:2,parents:[1,2,3,4,5]},{_id:2,level:2,parents:[3,4,5,6]},{_id:3,level:2,parents:[4,5,6]}];
        var thisCate = {};
        thisCate.level = Number(selected[0].level);
        thisCate._ids = [];
        thisCate.parents = [];
        for(var i=0;i<selected.length;i++){
          thisCate._ids.push(selected[i]._id);
          if(i === 0){
            thisCate.parents = selected[i].parents;
          }
          else{
            for(var j=0;j<thisCate.parents.length;j++){
              var index = selected[i].parents.indexOf(thisCate.parents[j])
              if(-1 === index){
                thisCate.parents.splice(j,1);
                j=j-1;
              }
            }
          }
        }
        console.log(thisCate);
        var relation = this.refs.relation.getDOMNode().value;
        if(relation === "child"){
          newCate.level = thisCate.level + 1;
          newCate.parents = thisCate._ids;
          newCate.children = [];
          socketCategory.emit('insertChild',{doc:newCate});
        }
        else if(relation ==="sibling"){
          newCate.level = thisCate.level;
          newCate.parents = thisCate.parents;
          newCate.children = [];
          socketCategory.emit('insertChild',{doc:newCate});
        }
        else{
          newCate.level = thisCate.level - 1;
          if(newCate.level === 0){
            alert("不能创建上级类目！");
          }
        }
      }
      else{
        alert('请选择类目！');
      }
      console.log(newCate);
    }
  },
  editCategory:function(){
    console.log("Enter editCategory");
    var selected = this.state.selected;
    if(selected.length == 0){
      alert("请选择类目！");
    }
    else{
    }
    console.log("Leave editCategory");
  },
  deleteCategory:function(){
    console.log("Enter deleteCategory");
    var selected = this.state.selected;
    if(selected.length == 0){
      alert("请选择类目！");
    }
    else{
      socketCategory.emit("remove",selected[this.maxLevel-1]);
    }
    console.log("Leave deleteCategory");
  },
  handleCategoryKeyPress: function(e){
    if(e.key === 'Enter'){
      this.createCategory();
    }
  },
  handleCategorySelect: function(e){
    console.log("Enter handleCategorySelect");
    var selected = this.state.selected;
    var maxLvSel = getSelectValues(e.target);
    console.log(maxLvSel);
    var newMaxLevel = maxLvSel[0].level;
    if(newMaxLevel === this.maxLevel){
      selected[newMaxLevel-1]=maxLvSel;
    }
    else if(newMaxLevel > this.maxLevel){
      selected.push(maxLvSel);
      this.maxLevel = newMaxLevel;
    }
    else if(newMaxLevel < this.maxLevel){
      selected.splice(newMaxLevel,this.maxLevel-newMaxLevel);
      selected[newMaxLevel-1]=maxLvSel;
      this.maxLevel = newMaxLevel;
    }

    this.setState({selected:selected});
    console.log("Leave handleCategorySelect");
  },
  moveUp:function(){
    console.log("Enter moveUp");
    var selected = this.state.selected;
    var maxLvSel = selected[this.maxLevel-1];
    console.log(maxLvSel);
    socketCategory.emit("moveUp",{_id:maxLvSel._id});
    console.log("Leave moveUp");
  },
  moveDown:function(){
    console.log("Enter moveDown");
    var selected = this.state.selected;
    var maxLvSel = selected[this.maxLevel-1];
    console.log(maxLvSel);
    socketCategory.emit("moveDown",{_id:maxLvSel._id});
    console.log("Leave moveDown");
  },
  render: function() {
    console.log("Enter render");
    if(this.inited){
      var selects = [];
      var selected = this.state.selected;
      var categories = db.categories.toArray();
      if(categories.length > 0){
        if(selected.length === 0){
          var options = [];
          for(var i=0;i<categories.length;i++){
            if(categories[i].level === 1){
              options.push(<option key={categories[i]._id} id={categories[i]._id} value={categories[i]._id} data-children={categories[i].children} data-parents={categories[i].parents} data-level={categories[i].level} data-number={categories[i].number} data-name={categories[i].name}>{categories[i].name}</option>);
            }
          }
          var select = <select key='sel1' id="sel1" multiple onChange={this.handleCategorySelect}>{options}</select>;
          selects.push(select);
        }
        else{
          var options = {};
          var level = this.maxLevel+1;
          //var maxLvSel = selected[this.maxLevel-1];
          var parents = [];
          parents.push([]);
          for(var i=0;i<selected.length;i++){
            var thisLvSel = selected[i];
            var thisLvParents = [];
            for(var j=0;j<thisLvSel.length;j++){
              thisLvParents.push(thisLvSel[j]._id);
            }
            parents.push(thisLvParents);
          }
          console.log("parents:",parents);
          console.log("level:",level);
          for(var i=0;i<categories.length;i++){
            console.log("categories[i].level:",categories[i].level);
            for(var j=1;j<=level;j++){
              console.log("j:",j);
              options[j] = options[j] || [];
              if(categories[i].level === j){
                if(j===1){
                  options[j].push(<option key={categories[i]._id} id={categories[i]._id} value={categories[i]._id} data-children={categories[i].children} data-parents={categories[i].parents} data-level={categories[i].level} data-number={categories[i].number} data-name={categories[i].name}>{categories[i].name}</option>);
                }
                else{
                  var thisLvParents = parents[j-1];
                  var allIn = true;
                  for(var k=0;k<thisLvParents.length;k++){
                    if(-1 === categories[i].parents.indexOf(thisLvParents[k])){
                      allIn = false;
                      break;
                    }
                  }
                  if(allIn){
                    options[j].push(<option key={categories[i]._id} id={categories[i]._id} value={categories[i]._id} data-children={categories[i].children} data-parents={categories[i].parents} data-level={categories[i].level} data-number={categories[i].number} data-name={categories[i].name}>{categories[i].name}</option>);
                  }
                }
              }
            }
          }
          console.log(options);
          for(var key in options){
            var select = <select key={'sel'+key} id={'sel'+key}  multiple onChange={this.handleCategorySelect}>{options[key]}</select>;
            selects.push(select);
          }
        }
      }
      console.log("Leave render");
      return(
        <div>
          <div className='form-inline' style={{margin:'10px'}}>
            <select ref="relation">
              <option value="child">子类目</option>
              <option value="sibling">同级类目</option>
            </select>
            <input type='text' ref='categoryName' onKeyPress={this.handleCategoryKeyPress}/>
            <button onClick={this.createCategory}>创建</button>
            <button onClick={this.deleteCategory}>删除</button>
            <button onClick={this.moveUp}>上移</button>
            <button onClick={this.moveDown}>下移</button>
            <button>左移</button>
            <button>右移</button>
          </div>
          <div ref='selected' style={{margin:'10px'}}></div>
          <div style={{margin:'10px'}}>
            {selects}
          </div>
        </div>
      )
    }
    else{
      console.log("Leave render");
      return(<div>未初始化</div>)
    }
  }
})

var Panel = React.createClass({
  getInitialState: function(){
    return {
      data_uri: null,
    };
  },
  componentDidMount: function(){
    socket = io(window.location.host + "/product");
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
  render: function() {
    return(
      <div>
        <ul className="nav nav-tabs" role="tablist">
          <li role="presentation" className="active"><a href="#category" aria-controls="category" role="tab" data-toggle="tab">选择类目</a></li>
          <li role="presentation"><a href="#props" aria-controls="props" role="tab" data-toggle="tab">产品属性</a></li>
          <li role="presentation" ><a href="#productMain" aria-controls="productMain" role="tab" data-toggle="tab">主要信息</a></li>
        </ul>
        <div className="tab-content">
          <div role="tabpanel" className="tab-pane active" id="category">
            <SelectCategory ref="SelectCategory"/>
          </div>
          <div role="tabpanel" className="tab-pane" id="props">...</div>
          <div className="panel panel-default tab-pane" role="tabpanel" id="productMain">
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

//ReactDOM.render(<App />, document.getElementById('example'))

if (isNode) {
  module.exports = App;
} else {
  dbEvents.on("inited",function(){
    ReactDOM.render(this.app, document.getElementById('example'));
  }.bind({app:<App />}));
}
