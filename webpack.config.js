module.exports = {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: __dirname + '/dist/browser',
		library: 'webauthn',
		libraryTarget: 'var',
	},
	optimization: {
		minimize: false,
	},
};
