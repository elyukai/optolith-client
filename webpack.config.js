var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		main: './js/AppBootstrap.js'
	},
	// devtool: 'source-map',
	output: {
		filename: 'dist/bundle.js'
	},
	module: {
		loaders: [
			{
                test: /\.js$/,
                exclude: /node_modules/,
				loader: 'babel',
			},
			{
                test: /\.scss$/,
                exclude: /node_modules/,
				loader: ExtractTextPlugin.extract('css?-url!sass'),
			}
		]
	},
	sassLoader: {
		outputStyle: 'compressed'
	},
    plugins: [
        new ExtractTextPlugin('dist/bundle.min.css')
	]
};
