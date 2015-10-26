var path = require('path');

module.exports = {
  entry: {
    'public/components/index': './views/components/index',
    'public/components/responsive_example': './views/components/responsive_example',
	  'public/components/starter': './views/components/starter',
    'public/components/responsive': './views/components/responsive',
  },

  output: {
    path: '.',
    filename: '[name].js',
    publicPath: '/public/components/'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional=es7.objectRestSpread'},
    ]
  },

  devServer: {
    contentBase: './views/components',
    host: 'localhost',
    inline: true,
    info: false
  }
};
