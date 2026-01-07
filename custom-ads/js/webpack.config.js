const config = require( 'flarum-webpack-config' );
const { merge } = require('webpack-merge');

module.exports = merge( config(), {
  entry: {
    forum: './src/forum.js',
    admin: './src/admin.js',
  },
});