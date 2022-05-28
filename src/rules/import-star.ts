import { TSESLint } from "@typescript-eslint/experimental-utils";

type MessageIds = "non-tree-shakable-access";

const importStarRule: TSESLint.RuleModule<MessageIds> = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Forbits non-tree-shakable access to module name space objects.",
      recommended: "error",
    },
    messages: {
      "non-tree-shakable-access":
        "This expression makes '{{ module }}' non-tree-shakable.",
    },
    schema: [],
  },
  create: function (context) {
    return {};
  },
};

export default importStarRule;
