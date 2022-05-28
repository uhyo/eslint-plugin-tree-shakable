import { TSESLint } from "@typescript-eslint/experimental-utils";
import { describe, it } from "vitest";
import importStarRule from "./import-star";

const ruleName = "import-star";

const tester = new TSESLint.RuleTester({
  parser: require.resolve("@typescript-eslint/parser"),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
});

describe("Property access", () => {
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
          },
        ],
      },
    ],
  });
});
