import type { Expression } from "./types";

export function evaluate(expression: Expression, x: number): number {
  switch (expression.type) {
    case "number":
      return expression.value;

    case "variable":
      return x;

    case "unary":
      return -evaluate(expression.operand, x);

    case "binary": {
      const left = evaluate(expression.left, x);
      const right = evaluate(expression.right, x);

      switch (expression.operator) {
        case "+":
          return left + right;

        case "-":
          return left - right;

        case "*":
          return left * right;

        case "/":
          return left / right;

        case "^":
          return Math.pow(left, right);
      }
      break;
    }

    case "function":
      throw new Error(`Function ${expression.name} is not supported yet`);
  }
}
