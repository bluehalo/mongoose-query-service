'use strict';

const should = require('should'),
	buildQuery = require('./build-query');

describe('Build Query', () => {

	const verifyEquals = (expected) => {
		return (actual) => {
			should(actual).eql(expected);
		};
	};

	it('should handle empty inputs with default', () => {
		return buildQuery({}).then(verifyEquals({
			limit: 20,
			page: 0,
			query: {},
			sorting: {}
		}));
	});

});
