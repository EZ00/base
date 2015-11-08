var isNode = typeof module !== 'undefined' && module.exports;
var React = isNode ? require('react') : window.React;
var ReactDom = isNode ? require('react-dom') : window.ReactDom;


var DrawerMenu = React.createClass({
  getInitialState: function() {
    return {
      checked: true,
      styleDrawerToggleLabel:'drawer-toggle-label drawer-toggle-label-checked',
      styleDrawerHeader:'drawer-header drawer-header-checked',
      styleDrawer:'drawer drawer-checked',
      stylePageContent:'page-content page-content-checked'
    };
  },
  handleDrawerToggle: function(e){
    console.log('before change:',this.state.checked);
    this.setState({checked:!this.state.checked},function(){
      console.log('after callback:',this.state.checked);
      if(this.state.checked == true){
        this.setState({
          styleDrawerToggleLabel:'drawer-toggle-label drawer-toggle-label-checked',
          styleDrawerHeader:'drawer-header drawer-header-checked',
          styleDrawer:'drawer drawer-checked',
          stylePageContent:'page-content page-content-checked'
        })
      }
      else{
        this.setState({
          styleDrawerToggleLabel:'drawer-toggle-label',
          styleDrawerHeader:'drawer-header',
          styleDrawer:'drawer',
          stylePageContent:'page-content'
        })
      }
    }.bind(this));
    //this.state.checked = !this.state.checked;
    console.log('after change:',this.state.checked);
  },
  render: function() {
    // console.log('before render drawerMenu, user is: '+this.props.user);
    return(
      <div>
        <label className={this.state.styleDrawerToggleLabel} onClick={this.handleDrawerToggle}></label>
        <header className={this.state.styleDrawerHeader}>{this.props.headerContent}</header>
        <nav className={this.state.styleDrawer}>
          {this.props.drawerContent}
        </nav>
        <div className={this.state.stylePageContent}>
           {this.props.children}
        </div>
      </div>
    );
  }
});

if (isNode) {
  module.exports = DrawerMenu;
}
