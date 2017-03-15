'use strict';

const should = require('should'),
	buildQuery = require('./build-query');

describe('Build Query', () => {

	const verifyEquals = (expected) => {
		return (actual) => {
			should(actual).eql(expected);
		};
	};

	it('should handle null inputs with default', () => {
		return buildQuery({}, {}).then(verifyEquals({
			limit: 20,
			page: 0,
			query: {},
			sorting: {}
		}));
	});

	it('should handle empty inputs with default', () => {
		return buildQuery({}, {}).then(verifyEquals({
			limit: 20,
			page: 0,
			query: {},
			sorting: {}
		}));
	});

	it('should build sorting array with set sort direction', () => {
		return buildQuery({ test: true }, { sort: 'name', dir: 'ASC' }).then(verifyEquals({
			limit: 20,
			page: 0,
			query: { test: true },
			sorting: { name: 1 }
		}));
	});

	it('should build sorting array with default sort direction', () => {
		return buildQuery({ test: 'false' }, { sort: 'name' }).then(verifyEquals({
			limit: 20,
			page: 0,
			query: { test: 'false' },
			sorting: { name: 1 }
		}));
	});

	it('should build sorting array with descending sort direction', () => {
		return buildQuery({}, { sort: 'name', dir: 'DESC' }).then(verifyEquals({
			limit: 20,
			page: 0,
			query: {},
			sorting: { name: -1 }
		}));
	});

});
