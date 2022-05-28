# eslint-plugin-tree-shakable

ESLint plugin to keep modules tree-shakable. Currently has one rule:

- **tree-shakable/import-star**: limits usage of variables imported with the `import *` syntax.

## Installation

```sh
npm i -D eslint-plugin-tree-shakable
```

```js
// .eslintrc.js
  "plugins": [
    // ...
    "tree-shakable"
  ],
```

## `tree-shakable/import-star`

```js
// .eslintrc.js
  "rules": {
    // ...
    "tree-shakable/import-star": ["error"]
  }
```

Examples of **incorrect** code for this rule:

```js
import * as t from "./mod";

// Incorrect: reference to the entire namespace prevents './mod' from being tree-shakable.
console.log(t);

// Incorrect: reference to variable property name prevents './mod' from being tree-shakable.
const name = "foo";
console.log(t[name]);
```

Examples of **correct** code for this rule:

```js
import * as t from "./mod";

// Correct: access with a statically-analyzable property name is fine.
console.log(t.foo);
```

### Options

Currently it has no options.

## Notes

The behavior of this rule is based on Webpack 5's tree-shaking and mangling behaviors. If you find different behaviors between bundlers, please let us know.

## Contributing

Welcome

## License

MIT
