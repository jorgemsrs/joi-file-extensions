"use strict";

const { readFileSync, existsSync } = require("fs");

module.exports = joi => ({
  type: "file",
  base: joi.string(),
  validate: function (value, { error }) {
    return existsSync(value) ? { value } : { errors: error('file.enoent', { f: value })};
  }, 
  messages: {
    'file.enoent': 'file "{{#f}}" does not exist',
    'file.error.generic': 'file could not be read. message: "{{#m}}"'
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
          // NOTE: we don't test for more scenarios because they tend to be platform specific
          // See https://nodejs.org/dist/latest-v12.x/docs/api/fs.html#fs_fs_readfile_path_options_callback
          return error('file.error.generic', { m: e.message });
        }
      }
    }
  }
});
