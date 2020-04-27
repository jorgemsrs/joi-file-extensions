"use strict";

const VICTIM_PATH = "../../";

const setup = () => {
  const BaseJoi = require("@hapi/joi");
  const FileExtension = require(VICTIM_PATH);

  return BaseJoi.extend(FileExtension);
};

const setupWithFile = (filename, content) => {
  const BaseJoi = require("@hapi/joi");
  const { writeFileSync } = require("fs");
  const FileExtension = require(VICTIM_PATH);

  writeFileSync(filename, content);

  return BaseJoi.extend(FileExtension);
};

const test = require("tape");

test("Value must be String", function(t) {
  t.plan(2);

  const Joi = setup();
  const schema = Joi.file();

  const { error } = schema.validate(3);

  t.notEqual(error, null);
  t.equal(error.message, '"value" must be a string');
});

test("Encoding must be 'utf8' or null", function(t) {
  t.plan(1);

  try {
    const Joi = setup();
    Joi.file().contents({ encoding: 'other' });
    t.fail();
  } catch(e) {
    t.equal(e.message, "encoding needs to be utf8 or null or reference");
  }
});

test("Fails when file can't be read", function(t) {
  t.plan(2);

  const Joi = setup();
  const schema = Joi.file().required();
  const filename = `file://${Date.now()}`;
  const expectedError = `file "${filename}" does not exist`;

  const { error } = schema.validate(filename);

  t.ok(error !== null);
  t.equal(error.message, expectedError);
});

test("Get file contents as Buffer", function(t) {
  t.plan(2);

  const filename = `/tmp/jfe-test-${Date.now()}`;
  const expectedContent = `just a test ${Date.now()}`;
  const Joi = setupWithFile(filename, expectedContent);
  const schema = Joi.file().contents({ encoding: null });

  const { value, error } = schema.validate(filename);

  t.ok(error === undefined);
  t.deepEqual(value, Buffer.from(expectedContent));
});

test("Get file contents as String (utf8)", function(t) {
  t.plan(2);

  const filename = `/tmp/jfe-test-${Date.now()}`;
  const expectedContent = `just a test ${Date.now()}`;
  const Joi = setupWithFile(filename, expectedContent);
  const schema = Joi.file().contents({ encoding: "utf8" });
  
  const { value, error } = schema.validate(filename);

  t.ok(error === undefined);
  t.deepEqual(value, expectedContent);
});
