# joi-file-extensions

Joi extensions for file rules.

# Usage

```js
const BaseJoi = require("joi");
const FileExtension = require("joi-date-extensions");
const Joi = BaseJoi.extend(FileExtension);

const schema = Joi.file().contents();
```