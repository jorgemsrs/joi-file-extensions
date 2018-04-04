"use strict";

const VICTIM_PATH = "../../";

const setup = () => {
  const BaseJoi = require("joi");
  const FileExtension = require(VICTIM_PATH);

  return BaseJoi.extend(FileExtension);
};

const setupWithFile = (filename, content) => {
  const BaseJoi = require("joi");
  const { writeFileSync } = require("fs");
  const FileExtension = require(VICTIM_PATH);

  writeFileSync(filename, content);

  return BaseJoi.extend(FileExtension);
};

const test = require("tape");

test("Value must be String", function(t) {
  t.plan(1);

  const Joi = setup();
  const schema = Joi.file();

  t.equal(
    Joi.validate(3, schema).error.message,
    '"value" file must be a String. Got "3"'
  );
});

test("Fails when file can't be read", function(t) {
  t.plan(2);

  const Joi = setup();
  const schema = Joi.file().required();
  const filename = `file://${Date.now()}`;
  const expectedError = `"value" file does not exist "${filename}"`;

  const result = Joi.validate(filename, schema);

  t.ok(result.error !== null);
  t.equal(result.error.message, expectedError);
});

test("Get file contents as Buffer", function(t) {
  t.plan(2);

  const filename = `/tmp/jfe-test-${Date.now()}`;
  const expectedContent = `just a test ${Date.now()}`;
  const Joi = setupWithFile(filename, expectedContent);
  const schema = Joi.file().contents(null);
  const result = Joi.validate(filename, schema);

  t.ok(result.error === null);
  t.deepEqual(result.value, Buffer.from(expectedContent));
});

test("Get file contents as String (utf8)", function(t) {
  t.plan(2);

  const filename = `/tmp/jfe-test-${Date.now()}`;
  const expectedContent = `just a test ${Date.now()}`;
  const Joi = setupWithFile(filename, expectedContent);
  const schema = Joi.file().contents("utf8");
  const result = Joi.validate(filename, schema);

  t.ok(result.error === null);
  t.deepEqual(result.value, expectedContent);
});
