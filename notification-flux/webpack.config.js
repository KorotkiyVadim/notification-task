/**
 * Created by Vadim on 05.10.2015.
 */

var path = require('path');
var config = {
    entry: path.resolve(__dirname, 'app/app.js'),
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
            loader: 'babel?stage=0' // The module to load. "babel" is short for "babel-loader"
        }]
    }
};

module.exports = config;