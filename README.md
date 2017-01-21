# @asymmetrik/node-module-template

[![Build Status](https://travis-ci.org/Asymmetrik/node-module-template.svg)](https://travis-ci.org/Asymmetrik/node-module-template)
[![Code Climate](https://codeclimate.com/github/Asymmetrik/node-module-template/badges/gpa.svg)](https://codeclimate.com/github/Asymmetrik/node-module-template)
[![Test Coverage](https://codeclimate.com/github/Asymmetrik/node-module-template/badges/coverage.svg)](https://codeclimate.com/github/Asymmetrik/node-module-template/coverage)
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

> Template project for a node module

## Table of Contents

- [Use](#use)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Use
To use this template, clone it, rename the ```origin``` remote to something else like ```template```. Then, add the new repo as origin. Once you've done this, it will be easier to merge in changes to the template into your project.

A second option is to clone this repo, delete the ```./.git``` directory, and then push it to your own repo.

See the gulpfile for tasks related to building the module.

## Install

Include this module as a dependency of your application in the `package.json` file. For example:
```
{
  ...
  dependencies: {
    "@asymmetrik/node-module-template": "latest"
  }
  ...
}
```

## Usage

Include the module via `require` wherever applicable:
```
var nodeModuleTemplate = require('@asymmetrik/node-module-template');
```

## API


## Contribute

PRs accepted.


## License

See LICENSE for details
