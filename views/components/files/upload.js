var isNode = typeof module !== 'undefined' && module.exports
var React = isNode ? require('react/addons') : window.React

if(isNode){
  var DrawerMenu = require('../drawerMenu');
  var VerticalMenu = require('../verticalMenu');
  var HeaderContent = require('../headerContent');
  //var Path = require('./path');
  //var SidebarContent = require('./sidebar_content');
}

var socket;
var SelectedFile;
var FReader;
var Name;

var Refresh = function(){
  location.reload(true);
}

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
          <span><a href='/en/dashboard/files'>文件</a></span>
          <span> > </span>
          <span>上传</span>
        </div>
      </div>
    )
  }
});


var Panel = React.createClass({
  getInitialState: function(){
    return {
      data_uri: null,
      UploadArea:<span id='UploadArea'>
        				<label htmlFor="FileBox">Choose A File: </label><input type="file" id="FileBox" onChange={this.FileChosen}/><br/>
        				<label htmlFor="NameBox">Name: </label><input type="text" id="NameBox"/><br/>
        				<button	type='button' id='UploadButton' className='Button' onClick={this.StartUpload}>Upload</button>
        			</span>
    };
  },
  componentDidMount: function(){
    socket = io(window.location.host + "/file");
    // socket.emit('hello',{msg:'hello socket'});
    socket.on('MoreData', function (data){
      this.UpdateBar(data['Percent']);
      var Place = data['Place'] * 524288; //The Next Blocks Starting Position
      var NewFile; //The Variable that will hold the new Block of Data
      if(SelectedFile.slice)
        NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
      else
        NewFile = SelectedFile.mozSlice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
      FReader.readAsBinaryString(NewFile);
    }.bind(this));
    socket.on('Done', function (data){
      var Content = "Video Successfully Uploaded !!"
      Content += "<img id='Thumb' src='" + data['url'] + "' alt='" + Name + "'><br>";
      Content += "<button	type='button' name='Upload' value='' id='Restart' class='Button'>Upload Another</button>";
      document.getElementById('UploadArea').innerHTML = Content;
      document.getElementById('Restart').addEventListener('click', Refresh);
      document.getElementById('UploadBox').style.width = '270px';
      document.getElementById('UploadBox').style.height = '270px';
      document.getElementById('UploadBox').style.textAlign = 'center';
      document.getElementById('Restart').style.left = '20px';
    });
    socket.on('create',function(data){
      if(data.err){
        alert(data.err);
      }
      else{
        window.location = "/en/dashboard/files/f/"+data.id;
      }
    })
  },
  componentWillUnmount: function() {
    socket.close();
  },
  FileChosen: function(evnt){
    SelectedFile = evnt.target.files[0];
    document.getElementById('NameBox').value = SelectedFile.name;
  },
  UpdateBar: function(percent){
		document.getElementById('ProgressBar').style.width = percent + '%';
		document.getElementById('percent').innerHTML = (Math.round(percent*100)/100) + '%';
		var MBDone = Math.round(((percent/100.0) * SelectedFile.size) / 1048576);
		document.getElementById('MB').innerHTML = MBDone;
  },
  StartUpload: function(){
    if(document.getElementById('FileBox').value != "")
    {
      console.log('this.StartUpload')
      FReader = new FileReader();
      Name = document.getElementById('NameBox').value;
      var Content = "<span id='NameArea'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
      Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">50%</span>';
      Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
      document.getElementById('UploadArea').innerHTML = Content;
      FReader.onload = function(evnt){
        socket.emit('Upload', { 'Name' : Name, Data : evnt.target.result });
      }
      socket.emit('Start', { 'Name' : Name, 'Size' : SelectedFile.size });
    }
    else
    {
      alert("Please Select A File");
    }
  },
  render: function() {
    return(
      <div id="UploadBox">
  			<h2>Uploader</h2>
        {this.state.UploadArea}
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
