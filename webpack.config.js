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
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'assets'),
      OtherModules: path.resolve(__dirname, 'other_modules'),
      Settings$: path.resolve(__dirname, 'settings.js'),
      Src: path.resolve(__dirname, 'src'),
      Test: path.resolve(__dirname, 'test'),
      TestViews: path.resolve(__dirname, 'test_views')
    }
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
