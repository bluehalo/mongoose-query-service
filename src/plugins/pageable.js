'use strict';

const _ = require('lodash');

/**
 * Translates the input sort array to an object with the properties specified.
 * Defaults to descending sort on each property
 */
const generateSort = (sorting) => {

	if(_.isArray(sorting)) {
		var sortObj = {};

		// Extract the sort instructions with defaults for DESC sort on each property
		_.forEach(sorting, (d) => {
			if(!_.isEmpty(d) && !_.isEmpty(d.property)) {
				sortObj[d.property] = (d.direction === 'ASC')? 1 : -1;
			}
		});

		return sortObj;
	}

	/*
	 * Otherwise, if it is not an array, assume that the value passed-in is
	 * a sorting object that the caller expected to be sent directly to the query
	 */
	return sorting;

};

/**
 * Adds a static method 'pagingSearch' to the schema that performs concurrent
 * count and search queries, returning the results in the project's standard
 * pagination format.
 *
 * Options are:
 * - query (default: {})
 * - projection (default: {})
 * - populate (optional)
 * - options (default: {})
 * - searchTerms (optional)
 * - sorting (default: {})
 * - page (default: 0)
 * - limit (optional)
 */
const pageable = (schema) => {

	/**
	 * Called in the scope of the Mongoose Schema that is invoked
	 * in order to reference it by "this"
	 */
	schema.statics.pagingSearch = function(searchConfig) {

		const query = _.get(searchConfig, 'query', {}),
			projection = _.get(searchConfig, 'projection', {}),
			options = _.get(searchConfig, 'options', {}),
			populate = _.get(searchConfig, 'populate', null),
			searchTerms = _.get(searchConfig, 'searchTerms', null),
			sortParams = _.get(searchConfig, 'sorting', {}),
			page = _.get(searchConfig, 'page', 0),
			limit = _.get(searchConfig, 'limit', null);

		const sort = generateSort(sortParams);

		/*
		 * If the searchTerms is provided, then build the
		 * text search and sort by its score
		 */
		if (!_.isEmpty(searchTerms)) {
			query.$text = { $search: searchTerms };
			projection.score = { $meta: 'textScore' };

			// Sort by textScore last if there is a searchTerms
			sort.score = { $meta: 'textScore' };
		}

		console.log(`Options: ${JSON.stringify(options)}`);

		let countPromise = this.count(query),
			searchPromise = this.find(query, projection, options).sort(sort);

		if (limit) {
			searchPromise = searchPromise.skip(page * limit).limit(limit);
		}

		if (populate) {
			searchPromise = searchPromise.populate(populate);
		}

		return Promise.all([ countPromise, searchPromise ])
			.then((results) => {
				const pageSize = limit ? limit : results[1].length;
				return {
					hasMore: results[0] > (page + 1) * pageSize,
					totalSize: results[0],
					pageNumber: page,
					pageSize: pageSize,
					totalPages: Math.ceil(results[0] / pageSize),
					elements: results[1]
				};
			});
	};

};

module.exports = pageable;
