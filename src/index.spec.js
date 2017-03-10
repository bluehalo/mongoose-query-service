'use strict';

const mongoose = require('mongoose'),
	should = require('should'),

	plugins = require('./plugins'),

	mongoDbTestConnectionString = 'mongodb://localhost/mongoose-query-service-test';

/*
 * Run before ALL tests in order to provide a mongoose connection
 */
before(() => {
	// connect to mongo test instance
	return mongoose.connect(mongoDbTestConnectionString);
});

/*
 * Drop the database after all tests
 */
after(() => {
	return mongoose.connection.db.dropDatabase().then(() => {
		return mongoose.disconnect();
	});
});

describe('Dependency Inclusion', () => {
	it('should have plugins', () => {
		['pageable', 'gettable'].forEach((pluginName) => {
			const plugin = plugins[pluginName];
			should.exist(plugin);
			should(plugin).be.a.Function();
		});
	});
});
