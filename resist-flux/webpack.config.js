const webpack = require('webpack');

module.exports = {
  //file to start with
  entry: [
    './src/index.ts', 
  ],

  //where compiled code should go
  output: {
    filename: "bundle.js", //combine it into this file
    path: '/dist', //in this folder (`__dirname`)
    // publicPath: 'dist' //where server will look for output
  },

  //which files should be considered (add in `.ts`)
  //https://webpack.github.io/docs/configuration.html#resolve-extensions
  resolve: {
    // Add '.ts' as resolvable extensions.
    extensions: ["*", ".webpack.js", ".web.js", ".js", ".ts", ".json"]
  },  
  module: {
    loaders: [
      // send `.ts` files through the loader
      { 
        test: /\.ts$/, 
        loader: "awesome-typescript-loader" 
      },
      //send output `.js` files through source-map loader
      //(to reprocess source maps for debugging)
      { 
        test: /\.js$/, 
        loader: "source-map-loader",
        enforce: 'pre'
      }
    ]
  },  

  //enable jQuery in all modules
  plugins: [
      new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
      })
  ],

  // Enable sourcemaps for debugging webpack's output
  devtool: "source-map",
}