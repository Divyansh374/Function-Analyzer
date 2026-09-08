import type { Expression } from "./types";

export function stringify(expression: Expression): string {
  switch (expression.type) {
    case "number":
      return String(expression.value);

    case "variable":
      return "x";

    case "unary":
      return `(-${stringify(expression.operand)})`;

    case "binary":
      return `(${stringify(expression.left)} ${expression.operator} ${stringify(expression.right)})`;

    case "function":
      return `${expression.name}(${stringify(expression.argument)})`;
  }
}
