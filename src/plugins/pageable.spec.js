'use strict';

const
	_ = require('lodash'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	should = require('should'),

	pageable = require('./pageable');

describe('pageable plugin', () => {

	let TestObject;

	/*
	 * Create the TestObjectSchema to use for the pageable tests
	 */
	before(() => {
		const TestObjectSchema = new Schema({
			content: { type: String }
		});
		TestObjectSchema.plugin(pageable);
		TestObjectSchema.index({ content: 'text' });
		mongoose.model('TestObject', TestObjectSchema, 'testobjects');
		TestObject = mongoose.model('TestObject', 'testobjects');
	});

	after(() => {
		return TestObject.collection.drop();
	});

	const uniqueSearchTerm = 'basement';

	const specs = [{
		content: 'How many chucks would a woodchuck chuck if a woodchuck could chuck wood?'
	}, {
		content: 'Johnny\'s in the ' + uniqueSearchTerm + ' mixing up the medicine'
	}, {
		content: 'How many roads must a man walk down before you can call him a man?'
	}];

	const verifyCount = (expectedCount) => {
		return TestObject.count().then((count) => {
			should(count).eql(expectedCount);
		});
	};

	it('should start with no test objects', () => {
		return verifyCount(0);
	});

	it('should add and count 3 test objects', () => {
		return Promise.all(_.map(specs, (spec) => {
			return new TestObject(spec).save();
		})).then(() => {
			return verifyCount(3);
		});
	});

	it('should use pageable plugin to return paged list', () => {
		return TestObject.pagingSearch({
			query: {},
			sorting: [],
			page: 0,
			limit: 2
		}).then((results) => {
				should.exist(results);
				should(results.totalSize).eql(3);
				should(results.pageNumber).eql(0);
				should(results.pageSize).eql(2);
				should(results.totalPages).eql(2);
				should(results.elements).be.a.Array();
				should(results.elements).have.length(2);
			});
	});

	it('should find one by text search', () => {
		return TestObject.pagingSearch({
			searchTerms: uniqueSearchTerm
		}).then((results) => {
				should.exist(results);
				should(results.totalSize).eql(1);
				should(results.pageNumber).eql(0);
				should(results.elements).be.a.Array();
				should(results.elements).have.length(1);
				should(results.elements[0].content).eql(specs[1].content);
			});
	});

	it('should accept and use sort parameters', () => {
		return TestObject.pagingSearch({
			sorting: [
				{ property: 'content', direction: 'DESC' },
				{ direction: 'ASC' }, // should handle, but skip a sorting input without a property
				null // should handle, but skip an empty sorting parameter
			]
		}).then((results) => {
				should.exist(results);
				should(results.totalSize).eql(3);
				should(results.pageNumber).eql(0);
				should(results.elements).be.a.Array();
				should(results.elements).have.length(3);
				should(results.elements[0].content).eql(specs[1].content);
				should(results.elements[1].content).eql(specs[2].content);
				should(results.elements[2].content).eql(specs[0].content);
			});
	});

	it('should accept and use ASC sort parameters', () => {
		return TestObject.pagingSearch({
			sorting: [
				{ property: 'content', direction: 'ASC' }
			]
		}).then((results) => {
				should.exist(results);
				should(results.totalSize).eql(3);
				should(results.pageNumber).eql(0);
				should(results.elements).be.a.Array();
				should(results.elements).have.length(3);
				should(results.elements[0].content).eql(specs[0].content);
				should(results.elements[1].content).eql(specs[2].content);
				should(results.elements[2].content).eql(specs[1].content);
			});
	});

	it('should use maxScan to limit queries', () => {
		return TestObject.pagingSearch({ maxScan: 2 }).then((results) => {
			should.exist(results);
			should(results.totalSize).eql(3); // count hits all
			should(results.pageNumber).eql(0);
			should(results.elements).be.a.Array();
			should(results.elements).have.length(2); // but length is limited
		});
	});

});