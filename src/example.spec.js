let
	should = require('should'),
	example = require('./example');

describe('Example', () => {

	it('should be \'Hello World\'', () => {
		should(example.example).equal('Hello World');
	});

	it('should not have a foo property', () => {
		should.not.exist(example.foo);
	});
});
