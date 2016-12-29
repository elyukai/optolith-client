var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = {
	entry: './src/index.tsx',
	output: {
		filename: 'bundle.js',
		path: __dirname + '/dist'
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	module: {
		rules: [
			{
                test: /\.tsx?$/,
				use: ['babel-loader', 'awesome-typescript-loader']
			},
			{
                test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
                test: /\.scss$/,
				use: ExtractTextPlugin.extract({ loader: 'css-loader?-url!sass-loader' }),
			}
		]
	},
    plugins: [
		new webpack.LoaderOptionsPlugin({ options: { sassLoader: {
			outputStyle: 'compressed'
		}}}),
        new ExtractTextPlugin({ filename: 'dist/bundle.min.css' })
	]
};
