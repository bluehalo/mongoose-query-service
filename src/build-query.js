'use strict';

const _ = require('lodash'),
	queryUtil = require('./query-util');

/**
 * Convert the input sort and dir parameters to a proper
 * sorting object with a default sort direction of ascending
 */
const getSorting = (pagingParams) => {

	let sort = _.get(pagingParams, 'sort');
	let dir = _.get(pagingParams, 'dir');

	// Sort can be null, but if it's non-null, dir defaults to ASC
	if (sort && !dir) {
		dir = 'ASC';
	}

	const sortParams = {};
	if (sort) {
		sortParams[sort] = dir === 'ASC' ? 1 : -1;
	}

	return sortParams;
};

/**
 * Converts an input query and paging parameters into a pageable query object
 * to be used with the pageable mongoose plugin's pagingSearch function.
 *
 * Returns a promise resolved with the resulting search config object
 */
module.exports = (query, pagingParams) => {
	return new Promise((resolve) => {

		let page = queryUtil.getPage(pagingParams);
		let limit = queryUtil.getLimit(pagingParams, 1000);

		const sorting = getSorting(pagingParams);

		resolve({
			query: query,
			sorting: sorting,
			page: page,
			limit: limit
		});
	});
};
