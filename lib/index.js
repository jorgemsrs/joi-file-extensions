"use strict";

const { readFileSync, existsSync } = require("fs");

module.exports = joi => ({
  type: "file",
  base: joi.string(),
  validate: function (value, { error }) {
    return existsSync(value) ? { value } : { errors: error('file.enoent', { f: value })};
  }, 
  messages: {
    'file.enoent': 'file "{{#f}}" does not exist'
  },

  rules: {
    "contents": {
      multi: false,

      method(options = { encoding: null }) {
        return this.$_addRule({ name: 'contents', args: { encoding: options.encoding } });
      },
      args: [
        {
          name: 'encoding',
          assert: (encoding) => ['utf8', null].includes(encoding),
          message: `needs to be ${['utf8', null].map(String).join(" or ")}`
        }
      ],

      validate(value, { error }, options) {
        try {
          return readFileSync(value, { encoding: options.encoding });
        } catch (e) {
          switch (e.code) {
            case "ENOENT":
              return error('file.enoent', { f: value });
          }
          return error(e.message)
        }
      }
    }
  }
});
