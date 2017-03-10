'use strict';

const
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,

	should = require('should'),

	gettable = require('./gettable');

describe('gettable plugin', () => {

	let Princess;

	/*
	 * Create the PrincessObjectSchema to use for the gettable tests
	 */
	before(() => {
		const PrincessObjectSchema = new Schema({
			name: {
				type: String,
				get: function(v) {
					return 'Princess ' + v;
				}
			}
		});
		PrincessObjectSchema.plugin(gettable);
		mongoose.model('Princess', PrincessObjectSchema, 'princesses');
		Princess = mongoose.model('Princess', 'princesses');
	});

	after(() => {
		return Princess.collection.drop();
	});

	it('should use implicit getter after save', () => {
		const model = new Princess({ name: 'Alice' });
		return model.save().then((result) => {
			should(result.name).eql('Princess Alice');
		});
	});

	it('should use explicit getter with toJSON', () => {
		const model = new Princess({ name: 'Alice' });
		return model.save().then((result) => {
			const actual = result.toJSON();
			should(actual.name).eql('Princess Alice');
			// raw mongo document should have base value
			should(result._doc.name).eql('Alice');
		});
	});

	it('should use explicit getter with toObject', () => {
		const model = new Princess({ name: 'Alice' });
		return model.save().then((result) => {
			const actual = result.toObject();
			should(actual.name).eql('Princess Alice');
			// raw mongo document should have base value
			should(result._doc.name).eql('Alice');
		});
	});

});
