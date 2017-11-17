var path = require("path");
var webpack = require("webpack");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");

var config = {
	entry: ["babel-polyfill", "./index.js"],
	output: {
		path: path.resolve(__dirname, "static"),
		filename: "main.[chunkhash:16].js"
	},
	resolve: {
		alias: {
			React: "react/dist/react.min.js",
			ReactDOM: "react-dom/dist/react-dom.min.js"
		}
	},
	module: {
		loaders: [
			{ 
				test: /\.js$/, 
				exclude: /node_modules/, 
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"latest",
							"react",
							"stage-0"         
						],
						plugins: [
							"transform-runtime",
							"transform-es2015-block-scoping"
							// "transform-es3-property-literals",
							// "transform-es3-member-expression-literals"
						]
					}
				} 
			},
			{ 
				test: /\.css$/, // Only .css files
				exclude: /node_modules/,
				loader: [ "style-loader", "css-loader" ] // Run both loaders
			}
		]
	},
	plugins: [
		new UglifyJSPlugin(),
		// new webpack.optimize.UglifyJsPlugin({
		//   minimize: true,
		//   mangle: false,
		//   output: {
		//     comments: false
		//   },
		//   'support-ie8': true,
		//   compress: {
		//     warnings: false
		//   }
		// }),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: "\"production\""
			}
		})
    
	]
  
};

module.exports = config;
