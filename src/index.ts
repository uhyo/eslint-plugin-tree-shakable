import importStarRule from "./rules/import-star";
export = {
  rules: {
    "import-star": importStarRule,
  },
  configs: {
    all: {
      plugins: ["tree-shakable"],
      rules: {
        "tree-shakable/import-star": "error",
      },
    },
  },
};
