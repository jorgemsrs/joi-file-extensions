"use strict";

const assert = require("assert");
const BaseJoi = require("joi");
const FileExtension = require("../lib");
const Joi = BaseJoi.extend(FileExtension);

const schema = Joi.file().contents(null);

// Test case: invalid config
assert(
  Joi.validate(3, schema).error.message ===
    '"value" file must be a String. Got "3"'
);

// Test case: valid config
const value = Joi.validate("/tmp/cenas", schema);
assert(value !== null);
console.log(value);

// Test case: file can't be read
const value2 = Joi.validate(`file://${Date.now()}`, schema);
assert(value2.error !== null);
console.log(value2);
