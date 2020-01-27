const spath = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: spath.resolve(__dirname, "dist"),
    },
}