"use strict";

const sinon = require('sinon');
const proxyquire = require('proxyquire').noCallThru();

const VICTIM_PATH = "../../";

const setup = (stubs) => {
  const BaseJoi = require("@hapi/joi");
  let FileExtension;
  if (stubs) FileExtension = proxyquire(VICTIM_PATH, stubs);
  else FileExtension = require(VICTIM_PATH);

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

test("Fails when file does not exist", function(t) {
  t.plan(2);

  const Joi = setup();
  const schema = Joi.file().required();
  const filename = `file://${Date.now()}`;
  const expectedError = `file "${filename}" does not exist`;

  const { error } = schema.validate(filename);

  t.ok(error !== null);
  t.equal(error.message, expectedError);
});

test("When no explicit encoding is specified, file contents are returned as Buffer", function(t) {
  t.plan(2);

  const filename = `/tmp/jfe-test-${Date.now()}`;
  const expectedContent = `just a test ${Date.now()}`;
  const Joi = setupWithFile(filename, expectedContent);
  const schema = Joi.file().contents();

  const { value, error } = schema.validate(filename);

  t.ok(error === undefined);
  t.deepEqual(value, Buffer.from(expectedContent));
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

test("Fails getting contents when readFileSync throws an unsupported error code", function(t) {
  t.plan(2);

  const e = new Error("cenas");
  const filename = Date.now().toString();
  const stubs = {
    fs: {
      existsSync: sinon.stub().onFirstCall().returns(true),
      readFileSync: sinon.stub().onFirstCall().throws(e)
    }
  }
  const Joi = setup(stubs);

  const schema = Joi.file().contents({ encoding: "utf8" });
  const { value, error } = schema.validate(filename);

  t.equal(value, filename);
  t.equal(error.message, `file could not be read. message: "${e.message}"`)
});

test("Fails getting contents when readFileSync throws ENOENT error code", function(t) {
  t.plan(2);

  const e = new Error("cenas");
  e.code = 'ENOENT';
  const filename = Date.now().toString();
  const stubs = {
    fs: {
      existsSync: sinon.stub().onFirstCall().returns(true),
      readFileSync: sinon.stub().onFirstCall().throws(e)
    }
  }
  const Joi = setup(stubs);

  const schema = Joi.file().contents({ encoding: "utf8" });
  const { value, error } = schema.validate(filename);

  t.equal(value, filename);
  t.equal(error.message, `file "${filename}" does not exist`)
});