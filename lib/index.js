"use strict";

const { readFileSync, existsSync } = require("fs");

module.exports = joi => ({
  name: "file",
  base: joi.any(),

  language: {
    enoent: 'file does not exist "{{v}}"',
    invalidType: 'file must be a String. Got "{{v}}"'
  },

  coerce(value, state, options) {
    if (typeof value !== "string") {
      return this.createError("file.invalidType", { v: value }, state, options);
    }

    // Validate exists
    if (!existsSync(value)) {
      return this.createError("file.enoent", { v: value }, state, options);
    }

    if (options.convert && this._flags.encoding !== undefined) {
      try {
        return readFileSync(value, {
          encoding: this._flags.encoding
        }); // Change the value
      } catch (e) {
        switch (e.code) {
          case "ENOENT":
            return this.createError(
              "file.enoent",
              { v: value },
              state,
              options
            );
            break;
        }
      }
    }

    return value; // Return unmodified value
  },

  rules: [
    {
      name: "contents",
      params: {
        e: joi
          .any()
          .valid(["utf8", null]) // Support only utf8 and buffer (raw) encodings
          .optional()
          .default(null)
      },
      description(params) {
        return `Load the file contents with encoding "${params.e}"`;
      },
      setup(params) {
        this._flags.encoding = params.e;
      },
      validate(params, value, state, options) {
        // No-op just to enable description
        return value;
      }
    }
  ]
});
