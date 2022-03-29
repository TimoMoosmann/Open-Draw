const path = require('path'); 

module.exports = {
    entry: {
      main: './src/index.js',
      'study': './src/calibration_study/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/bundled'),
    },
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
