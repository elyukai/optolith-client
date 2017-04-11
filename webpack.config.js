var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = {
	entry: './src/MainRenderer.tsx',
	output: {
		filename: 'bundle.js',
		path: __dirname + '/resources'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		rules: [
			{
                test: /\.tsx?$/,
				use: ['awesome-typescript-loader']
			},
			{
                test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					use: [
						'css-loader?-url',
						'sass-loader'
					]
				}),
			}
		]
	},
    plugins: [
        new ExtractTextPlugin('bundle.css'),
		new webpack.LoaderOptionsPlugin({ options: { sassLoader: {
			outputStyle: 'compressed'
		}}})
	],
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	},
	target: 'electron-renderer'
};
