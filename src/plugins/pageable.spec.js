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
			content: { type: String },
			parent: { type: Schema.Types.ObjectId, ref: 'TestObject' }
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

	const specs = {
		parent: {
			content: 'These times they are a changing'
		},
		children: [{
			content: 'How many chucks would a woodchuck chuck if a woodchuck could chuck wood?'
		}, {
			content: 'Johnny\'s in the ' + uniqueSearchTerm + ' mixing up the medicine'
		}, {
			content: 'How many roads must a man walk down before you can call him a man?'
		}]
	};

	// Populated in the first test
	let parentModel;

	const verifyCount = (expectedCount) => {
		return TestObject.count().then((count) => {
			should(count).eql(expectedCount);
		});
	};

	it('should start with no test objects', () => {
		return verifyCount(0);
	});

	it('should create a parent test object without parents', () => {
		return new TestObject(specs.parent).save()
			.then((result) => {
				parentModel = result;
			}).then(() => {
				return verifyCount(1);
			});
	});

	it('should add and count 3 test objects with the same parent', () => {
		return Promise.all(_.map(specs.children, (spec) => {
			const obj = new TestObject(spec);
			obj.parent = parentModel;
			return obj.save();
		})).then(() => verifyCount(4));
	});

	it('should use pageable plugin to return paged list', () => {
		return TestObject.pagingSearch({
			query: {},
			sorting: [],
			page: 0,
			limit: 2
		}).then((results) => {
				should.exist(results);
				should(results.hasMore).eql(true);
				should(results.totalSize).eql(4);
				should(results.pageNumber).eql(0);
				should(results.pageSize).eql(2);
				should(results.totalPages).eql(2);
				should(results.elements).be.a.Array();
				should(results.elements).have.length(2);
			});
	});

	it('should use pageable plugin to return last page of list', () => {
		return TestObject.pagingSearch({
			query: {},
			sorting: [],
			page: 1,
			limit: 2
		}).then((results) => {
				should.exist(results);
				should(results.hasMore).eql(false);
				should(results.totalSize).eql(4);
				should(results.pageNumber).eql(1);
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
				should(results.hasMore).eql(false);
				should(results.totalSize).eql(1);
				should(results.pageNumber).eql(0);
				should(results.pageSize).eql(1);
				should(results.elements).be.a.Array();
				should(results.elements).have.length(1);
				should(results.elements[0].content).eql(specs.children[1].content);
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
				should(results.hasMore).eql(false);
				should(results.totalSize).eql(4);
				should(results.pageNumber).eql(0);
				should(results.pageSize).eql(4);
				should(results.elements).be.a.Array();
				should(results.elements).have.length(4);
				should(results.elements[0].content).eql(specs.parent.content);
				should(results.elements[1].content).eql(specs.children[1].content);
				should(results.elements[2].content).eql(specs.children[2].content);
				should(results.elements[3].content).eql(specs.children[0].content);
			});
	});

	it('should accept and use ASC sort parameters with population', () => {
		return TestObject.pagingSearch({
			sorting: [
				{ property: 'content', direction: 'ASC' }
			],
			populate: 'parent'
		}).then((results) => {
				should.exist(results);
				should(results.hasMore).eql(false);
				should(results.totalSize).eql(4);
				should(results.pageNumber).eql(0);
				should(results.pageSize).eql(4);
				should(results.elements).be.a.Array();
				should(results.elements).have.length(4);
				should(results.elements[0].content).eql(specs.children[0].content);
				should(results.elements[1].content).eql(specs.children[2].content);
				should(results.elements[2].content).eql(specs.children[1].content);
				should(results.elements[3].content).eql(specs.parent.content);

				// Ensure that all children elements have the parent populated
				_.forEach([0, 1, 2], (childIndex) => {
					should.exist(results.elements[childIndex].parent);
					should(results.elements[childIndex].parent.content).eql(specs.parent.content);
				});
			});
	});

	it('should use maxScan to limit queries', () => {
		return TestObject.pagingSearch({ maxScan: 2 }).then((results) => {
			should.exist(results);
			should(results.hasMore).eql(true);
			should(results.totalSize).eql(4); // count hits all
			should(results.pageNumber).eql(0);
			should(results.pageSize).eql(2);
			should(results.elements).be.a.Array();
			should(results.elements).have.length(2); // but length is limited
		});
	});

});
