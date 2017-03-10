'use strict';

const mongoose = require('mongoose'),
	should = require('should'),

	thisModule = require('../index'),
	plugins = thisModule.plugins,

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

describe('Plugin Dependency Inclusion', () => {
	it('should have plugins', () => {
		should.exist(plugins);
	});

	it('should have specific plugins', () => {
		['pageable', 'gettable'].forEach((pluginName) => {
			const plugin = plugins[pluginName];
			should.exist(plugin);
			should(plugin).be.a.Function();
		});
	});
});

describe('Service Dependency Inclusion', () => {
	it('should have request to query converter', () => {
		should.exist(thisModule.buildQuery);
	});
});
