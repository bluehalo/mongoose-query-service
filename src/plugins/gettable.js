'use strict';

/**
 * Adds a static method 'pagingSearch' to the schema that performs concurrent
 * count and search queries, returning the results in the project's standard
 * pagination format.
 *
 * Options are:
 * - query (default: {})
 * - projection (default: {})
 * - options (default: {})
 * - searchTerms (optional)
 * - sorting (default: {})
 * - page (default: 0)
 * - limit (optional)
 */
const gettable = (schema) => {

	schema.set('toObject', { getters: true });
	schema.set('toJSON', { getters: true });

};

module.exports = gettable;
