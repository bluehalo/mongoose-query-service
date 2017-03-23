'use strict';

const _ = require('lodash'),
	mongoose = require('mongoose');

const notEmpty = (input) => {
	return !_.isEmpty(input);
};

/**
 * Returns true of the input value is not empty (using the lodash _.isEmpty function)
 */
module.exports.validateNonEmpty = notEmpty;

/**
 * Parse an input as a date. Handles various types
 * of inputs, such as Strings, Date objects, and Numbers.
 *
 * @param {date} The input representing a date / timestamp
 * @returns The timestamp in milliseconds since the Unix epoch
 */
module.exports.parseDate = function (date) {

	// Handle nil values by simply returning null
	if (_.isNil(date)) {
		return null;
	}

	// Date object should return its time in milliseconds
	if (_.isDate(date)) {
		return date.getTime();
	}

	// A number that exists will be interpreted as millisecond
	if (_.isFinite(date)) {
		return date;
	}

	// Handle String, Object, etc.
	return Date.parse(date);
};

/**
 * Get the limit provided by the user, if there is one.
 * Limit has to be at least 1 and no more than 100, with
 * a default value of 20.
 *
 * @param queryParams
 * @param maxSize (optional) default: 100
 * @returns {number}
 */
module.exports.getLimit = function (queryParams, maxSize) {
	const max = maxSize || 100;
	const limit = _.get(queryParams, 'size', 20);
	return isNaN(limit) ? 20 : Math.max(1, Math.min(max, Math.floor(limit)));
};

/**
 * Page needs to be positive and has no upper bound
 * @param queryParams
 * @returns {number}
 */
module.exports.getPage = function (queryParams) {
	const page = _.get(queryParams, 'page', 0);
	return isNaN(page) ? 0 : Math.max(0, page);
};

/**
 * Determine if an array contains a given element by doing a deep comparison.
 * @param arr
 * @param element
 * @returns {boolean} True if the array contains the given element, false otherwise.
 */
module.exports.contains = function(arr, element) {
	for (var i = 0; i < arr.length; i++) {
		if (_.isEqual(element, arr[i])) {
			return true;
		}
	}
	return false;
};

/**
 * Private method that guarantees that the nonMongoFunction input
 * is a valid input
 */
const propToMongoose = (prop, nonMongoFunction) => {
	if(_.isNil(prop)) {
		return null;
	}

	if (typeof prop === 'object' && prop.$date != null && typeof prop.$date === 'string') {
		return new Date(prop.$date);
	} else if (typeof prop === 'object' && prop.$obj != null && typeof prop.$obj === 'string') {
		return mongoose.Types.ObjectId(prop.$obj);
	}

	return nonMongoFunction(prop);
};

/**
 * Converts an input Mongo query, possibly with $date and $obj attributes, to a query that
 * Mongoose supports with Date and ObjectId objects mapped from those inputs as appropriate.
 * @param obj
 * @returns {object}
 */
const toMongoose = (obj) => {
	if (null != obj) {
		if (typeof obj === 'object') {
			if (Array.isArray(obj)) {
				var arr = [];

				for (var index in obj) {
					arr.push(propToMongoose(obj[index], toMongoose));
				}

				return arr;
			} else {
				var newObj = {};

				for (var prop in obj) {
					newObj[prop] = propToMongoose(obj[prop], toMongoose);
				}

				return newObj;
			}
		}
	}

	return obj;
};

exports.toMongoose = toMongoose;
