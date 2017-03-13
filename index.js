'use strict';

const plugins = require('./src/plugins'),
	buildQuery = require('./src/build-query'),
	queryUtil = require('./src/query-util');

module.exports = {

	plugins: plugins,

	buildQuery: buildQuery,

	// from query-util
	validateNonEmpty: queryUtil.validateNonEmpty,
	parseDate: queryUtil.parseDate,
	getLimit: queryUtil.getLimit,
	getPage: queryUtil.getPage,
	contains: queryUtil.contains,
	toMongoose: queryUtil.toMongoose

};
