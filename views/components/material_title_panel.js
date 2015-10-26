var isNode = typeof module !== 'undefined' && module.exports
  , React = isNode ? require('react/addons') : window.React
//import React from 'react/addons';

//const update = React.addons.update;
const update = React.update;

const styles = {
  root: {
   fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
   fontWeight: 300,
  },
  header: {
    backgroundColor: '#03a9f4',
    color: 'white',
    padding: '16px',
    fontSize: '1.5em',
  },
  content: {
    padding: '16px',
  },
};

class MaterialTitlePanel extends React.Component {
  render() {
    let rootStyle = this.props.style ?
                      update(styles.root, {$merge: this.props.style}) :
                      styles.root;

    return (
      <div style={rootStyle}>
        <div style={styles.header}>{this.props.title}</div>
        <div style={styles.content}>{this.props.children}</div>
      </div>
    );
  }
}

if (isNode) {
  module.exports = MaterialTitlePanel;
}

//export default MaterialTitlePanel;
