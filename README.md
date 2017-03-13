# @asymmetrik/mongoose-query-service

[![Build Status](https://travis-ci.org/Asymmetrik/mongoose-query-service.svg)](https://travis-ci.org/Asymmetrik/mongoose-query-service)
[![Code Climate](https://codeclimate.com/github/Asymmetrik/mongoose-query-service/badges/gpa.svg)](https://codeclimate.com/github/Asymmetrik/mongoose-query-service)
[![Test Coverage](https://codeclimate.com/github/Asymmetrik/mongoose-query-service/badges/coverage.svg)](https://codeclimate.com/github/Asymmetrik/mongoose-query-service/coverage)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> NPM module to provide common services and plugins for Mongoose models

## Table of Contents

- [Use](#use)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Use
`@asymmetrik/mongoose-query-service` provides utility services for creating and executing Mongoose queries based on a simple input search object. Additionally, it provides several plugins (`pageable` and `gettable`) that can be applied to Mongoose Schemas to allow them to add functionality to those Mongoose Schemas.

## Install

Include this module as a dependency of your application in the `package.json` file. For example:
```
{
  ...
  dependencies: {
    "@asymmetrik/mongoose-query-service": "latest"
  }
  ...
}
```

## Usage

Include the module via `require` wherever applicable:
```
var mongooseQueryService = require('@asymmetrik/mongoose-query-service');
```

### Plugins

Apply any of the plugins to a Mongoose model using the `.plugin(...)` method provided by Mongoose. For example:
```
var Person = new Schema({});
Person.plugin(mongooseQueryService.plugins.pageable);
```

### Services

Service methods are available from the base `@asymmetrik/mongoose-query-service` module, and can be called directly with the parameters defined in the API below.

## API

### Plugins

The following plugins are available at the top level `plugins` attribute:

#### pageable

Applying the `pageable` plugin at `mongooseQueryService.plugins.pageable` adds a static method to Mongoose model called `pagingSearch` that takes an input object parameter with the following attributes:

Attribute | Optional? | Default | Description
------------ | ------------- | ------------ | -------------
query | Yes | `{}` | Filters to pass to the Mongo query
projection | Yes | `{}` | Attributes to return in the elements
options | Yes | `{}` | Query options specified by Mongoose
searchTerms | Yes | null | String of search terms that will be translated into a search on the text index for the model
sorting | Yes | {} | Attributes for sorting and directions of each sort. Defaults to descending sort. Accepts either an object with a standard Mongo sorting config or an array of objects with `property` and `direction` attributes that will be translated into the standard Mongo sorting config.
page | Yes | 0 | To support paged searches, combines with `limit` to set the `skip` attribute of the Mongo query. If `limit` is not provided, `page` is not used.
limit | Yes | null | If provided, returns up to this number of results. Combines with the `page` parameter when setting the `skip` attribute of the Mongo query
maxScan | Yes | null | If provided, the results aspect of the query will only scan up to this number of documents in Mongo. However, it will not be used in the total count aspect of the query since this is not supported by Mongoose.

The `pagingSearch` method returns a Promise resolved with an object with the following attributes:

Attribute | Type | Description
------------ | ------------- | ------------ | -------------
hasMore | Boolean | Indicates if more documents are available if the next page of results is queried
totalSize | Number | The total count of documents that passed the query filter
pageNumber | Number | The current page of results returned. `0` if not paging
pageSize | Number | The current size of each page returned. Set to the input `limit` value
totalPages | Number | The number of pages from the the total size and page size configuration
elements | Array | The results that were found matching the current page.

*Example:*
```
var Person = new Schema({});
Person.plugin(mongooseQuerySchema.plugins.pageable);
```

#### gettable

Applying the `gettable` plugin at `mongooseQueryService.plugins.gettable` sets the `toObject` and `toJSON` attributes of the Mongoose Schema to `{ getters: true }` so that any `get` method defined in a Schema Type is used when the `toObject` or `toJSON` methods are invoked on the Mongoose model.

*Example:*
```
var Person = new Schema({});
Person.plugin(mongooseQuerySchema.plugins.gettable);
```

### Services

#### validateNonEmpty
Returns true of the input value is not empty (using the lodash *isEmpty* function)

#### parseDate
Parse an input as a date. Handles various types of inputs, such as Strings, Date objects, and Numbers.

@param {date} The input representing a date / timestamp

@returns The timestamp in milliseconds since the Unix epoch

#### getLimit
Get the limit provided by the input query parameters, if there is one. Limit is taken from the `size` attribute of the input `queryParams` object. Limit has to be at least 1 with a default value of 20 and no more than the max value.

@param queryParams

@param maxSize (optional) default: 100

@returns {number}

#### getPage
Page needs to be positive and has no upper bound. Taken from the `page` attribute of the input `queryParams` object. Defaults to 0.

@param queryParams

@returns {number}

#### contains
Determine if an array contains a given element by doing a deep comparison.

@param arr

@param element

@returns {boolean} True if the array contains the given element, false otherwise.

#### toMongoose
Converts an input Mongo query, possibly with $date and $obj attributes, to a query that Mongoose supports with Date and ObjectId objects mapped from those inputs as appropriate.

@param obj

@returns {object}

## Contribute

PRs accepted.


## License

See LICENSE for details
