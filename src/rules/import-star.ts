import { TSESLint, TSESTree } from "@typescript-eslint/experimental-utils";

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
    return {
      ImportNamespaceSpecifier(node) {
        // import * as mod from 'specifier'
        const identifier = node.local;
        const moduleName = getModuleSpecifier(node);
        checkModuleNamespaceUsage(context, moduleName, identifier);
      },
    };
  },
};

export default importStarRule;

function getModuleSpecifier(node: TSESTree.ImportNamespaceSpecifier): string {
  const parent = node.parent;
  if (parent === undefined) {
    throw new Error("Cannot find parent of ImportNamespaceSpecifier");
  }
  if (parent.type !== TSESTree.AST_NODE_TYPES.ImportDeclaration) {
    throw new Error(
      "Cannot find ImportDeclaration for given ImportNamespaceSpecifier"
    );
  }
  return parent.source.value;
}

function checkModuleNamespaceUsage(
  context: Readonly<TSESLint.RuleContext<MessageIds, unknown[]>>,
  moduleName: string,
  identifier: TSESTree.Identifier
) {
  const scope = context.getScope();
  const variable = scope.set.get(identifier.name);
  for (const ref of variable.references) {
    const referencedIdentifier = ref.identifier;
    if (
      referencedIdentifier.type !== TSESTree.AST_NODE_TYPES.Identifier ||
      !isTreeShakingSafeReference(referencedIdentifier)
    ) {
      context.report({
        node: referencedIdentifier,
        messageId: "non-tree-shakable-access",
        data: {
          module: moduleName,
        },
      });
    }
  }
}

function isTreeShakingSafeReference(identifier: TSESTree.Identifier): boolean {
  // Only allow `id.foo` or `id["foo"]` references.
  const parent = identifier.parent;
  if (parent === undefined) {
    return false;
  }

  if (parent.type === TSESTree.AST_NODE_TYPES.MemberExpression) {
    if (!parent.computed) {
      // id.foo
      return true;
    }
    const memberName = parent.property;
    if (memberName.type === TSESTree.AST_NODE_TYPES.Literal) {
      // id["foo"]
      return true;
    }
  }
  return false;
}
