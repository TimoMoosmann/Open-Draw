const path = require('path'); 

module.exports = {
    entry: {
      main: './src/index.js',
      study: './src/calibration_study/index.js',
      tests: './test_views/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/bundled'),
    },
    mode: process.env.NODE_ENV || 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ],
    },
};
