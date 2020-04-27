# joi-file-extensions

Joi extensions for file rules.

[![Build Status](https://travis-ci.org/jorgemsrs/joi-file-extensions.svg?branch=master)](https://travis-ci.org/jorgemsrs/joi-file-extensions)
[![Coverage Status](https://coveralls.io/repos/github/jorgemsrs/joi-file-extensions/badge.svg?branch=master)](https://coveralls.io/github/jorgemsrs/joi-file-extensions?branch=master)

# Usage

```js
const joi = require("@hapi/joi");
const customJoi = BaseJoi.extend(require("joi-file-extensions"));

const schema = customJoi.file().contents();
```

## Directory layout

Follows [CommonJS Package Directory Layout](http://wiki.commonjs.org/wiki/Packages/1.0#Package_Directory_Layout) guidelines.
