import React from 'react';
import Sidebar from './sidebar';

var App = React.createClass({
  getInitialState: function() {
    return {
      sidebarOpen: false,
      sidebarDocked: true,
    };
  },

  onSetSidebarOpen: function(open) {
    this.setState({sidebarOpen: open});
  },

  render: function() {
    var sidebarContent = <b>Sidebar content</b>;

    return (
      <Sidebar sidebar={sidebarContent}
               open={this.state.sidebarOpen}
               docked={this.state.sidebarDocked}
               onSetOpen={this.onSetSidebarOpen}>
        <b>Main content</b>
      </Sidebar>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('example'))

module.exports = App;
