import { TSESLint } from "@typescript-eslint/utils";
import { describe } from "vitest";
import importStarRule from "./import-star";

const ruleName = "import-star";

const tester = new TSESLint.RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

describe("Basic Function", () => {
  tester.run(ruleName, importStarRule, {
    valid: [
      {
        code: `
import * as t from "foo";
console.log(t.foo);
`,
      },
      {
        code: `
import * as t from 'foobar'
const a = t["foo"];
`,
      },
    ],
    invalid: [
      {
        code: `
import * as t from 'foo';
console.log(t[Math.random()]);
`,
        errors: [
          {
            messageId: "non-tree-shakable-access",
            data: { module: "foo" },
            // 't' in `t[Math.random()]`
            line: 3,
            column: 13,
          },
        ],
      },
      {
        code: `
import * as t from './aiu';
console.log(t[Math.random() ? "foo" : "bar" ]);
`,
        errors: [
          {
            messageId: "non-tree-shakable-access",
            data: { module: "./aiu" },
            // 't' in `t[...]`
            line: 3,
            column: 13,
          },
        ],
      },
      {
        code: `
import * as t from './aiu';
const obj = t;
console.log(obj.foo);
`,
        errors: [
          {
            messageId: "non-tree-shakable-access",
            data: { module: "./aiu" },
            // 't' in `const obj = t`
            line: 3,
            column: 13,
          },
        ],
      },
      {
        code: `
import * as t from './aiu';
// Webpack cannot handle this case
console.log(t[\`foo\`]);
`,
        errors: [
          {
            messageId: "non-tree-shakable-access",
            data: { module: "./aiu" },
            // 't' in `const obj = t`
            line: 4,
            column: 13,
          },
        ],
      },
      {
        code: `
import * as t from './pikachu';
// Webpack cannot handle this case
const { foo } = t;
console.log(foo);
`,
        errors: [
          {
            messageId: "non-tree-shakable-access",
            data: { module: "./pikachu" },
            line: 4,
            column: 17,
          },
        ],
      },
    ],
  });
});

describe("TypeScript concerns", () => {
  tester.run(ruleName, importStarRule, {
    valid: [
      {
        name: "TypeScript's 'typeof' should not affect tree shaking",
        code: `
import * as t from 'foo';
type K = keyof typeof t[Foo];
`,
      },
    ],
    invalid: [
      {
        name: "JavaScript 'typeof' should be still forbidden",
        code: `
import * as t from 'foo';
const a = typeof t;
`,
        errors: [
          {
            messageId: "non-tree-shakable-access",
            data: { module: "foo" },
            // 't' in `typeof t`
            line: 3,
            column: 18,
          },
        ],
      },
    ],
  });
});
