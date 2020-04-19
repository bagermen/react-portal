"use strict";
/* jslint node: true*/

const merge = require('webpack-merge');
const baseConfig = require('./webpack/base.config');
const prodConfig = require('./webpack/prod.config');
const devConfig = require('./webpack/dev.config');

const smartMerge = merge.smartStrategy({
	'module.rules.use': 'prepend',
	'plugins': 'prepend'
});

if (process.env.NODE_ENV === 'production') {
	module.exports = smartMerge(baseConfig, prodConfig);
} else {
	module.exports = smartMerge(baseConfig, devConfig);
}