var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react/addons') : window.React;

// var tags = [
//   'tag a',
//   'tag b',
//   'tag c'
// ];

var socket;

var TagItem = React.createClass({
  render: function() {
    return (
      <div className='tag-item'>
        <span >{this.props.text}</span>
        <a className='remove-button' onClick={this.props.handleDelete}>×</a>
      </div>
    )
  }
});

var TagsInput = React.createClass({
  getInitialState: function(){
    // console.log('handleDelete',this.handleDelete);
    this.tags = this.props.tags;
    if(!isNode){
      $.get(this.props.source, function(result) {
        //console.log(result);
        this.options = JSON.parse(result);
        var options = [];
        for(var i=0;i < this.options.length;i++){
          options.push(<option key={'op'+i} value={this.options[i].username}></option>);
        }
        this.setState({datalist:options});
      }.bind(this));
    }
    var i = 0;
    return {
      tagItems: this.props.tags.map(function(tag){
        i = i+1;
        return <TagItem key={i} text={tag.username} handleDelete={this.handleDelete.bind(this,tag.username)}/>;
      }.bind(this))
    }
  },
  handleDelete: function(tag){
    console.log('before delete: ',tag);
    //console.log(this.state.tagItems);
    // var index = this.tags.indexOf(tag);
    var index = 0;
    for(var i=0;i<this.tags.length;i++){
      if(this.tags[i].username === tag){
        index = i;
        break;
      }
    }
    this.tags.splice(index, 1);
    var newItems = this.state.tagItems.slice(); //copy array
    newItems.splice(index, 1); //remove element
    this.setState({tagItems: newItems}); //update state
  },
  handleKeyPress: function(e){
    //console.log('onKeyPress: ');
    //e.preventDefault();
    //console.log(e.key);
    if(e.key === 'Enter'){
      //console.log(e.target.value);
      var newTag=e.target.value;
      var exists = false;

      // if(this.options.indexOf(newTag) === -1){
      //   alert('该用户不存在！');
      //   return null;
      // }
      for(var i=0;i<this.options.length;i++){
        console.log(this.options[i]);
        if(this.options[i].username === newTag){
          this.tags.push(this.options[i]);
          exists = true;
          break;
        }
      }
      if(!exists){
        alert('该用户不存在！');
        return null;
      }
      //console.log(this.tags);
      for(var i=0;i<this.tags.length;i++){
        if(newTag.username === this.tags[i].username){
          alert('该项已经存在，请不要重复添加！');
          return null;
        }
      }
      e.target.value='';
      this.addTag(newTag);
    }
  },
  addTag: function(tag){
    //this.tags.push(tag);
    var index = this.tags.length+1;
    var item = <TagItem key={index} text={tag} handleDelete={this.handleDelete.bind(this,tag)}/>
    //this.state.tagItems.push(item);
    this.setState({
      tagItems:this.state.tagItems.concat([item])
    },function(){
      //console.log(this.state.tagItems)
    })
    //console.log(this.state.tagItems)
  },
  render: function() {
    // console.log('render tagsInput')
    return (
      <div className='tags-input'>
        <div className='tag-container' ref='tagContainer'>
          {this.state.tagItems}
        </div>
        <div className='input-container'>
          <datalist id="datalist">{this.state.datalist}</datalist>
          <input type='text' list='datalist' className='form-control' placeholder={this.props.placeholder} onKeyPress={this.handleKeyPress}></input>
        </div>
      </div>
    )
  }
});

if (isNode) {
  module.exports = TagsInput;
}
