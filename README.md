# joi-file-extensions

Joi extensions for file rules.

[![Build Status](https://travis-ci.org/jorgemsrs/joi-file-extensions.svg?branch=master)](https://travis-ci.org/jorgemsrs/joi-file-extensions)

# Usage

```js
const BaseJoi = require("@hapi/joi");
const FileExtension = require("joi-file-extensions");
const Joi = BaseJoi.extend(FileExtension);

const schema = Joi.file().contents();
```

## Directory layout

Follows [CommonJS Package Directory Layout](http://wiki.commonjs.org/wiki/Packages/1.0#Package_Directory_Layout) guidelines.
