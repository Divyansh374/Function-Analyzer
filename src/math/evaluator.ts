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

    case "function": {
      const argument = evaluate(expression.argument, x);

      switch (expression.name) {
        case "sin":
          return Math.sin(argument);

        case "cos":
          return Math.cos(argument);

        case "tan":
          return Math.tan(argument);

        case "sqrt":
          return Math.sqrt(argument);

        case "log":
          return Math.log(argument);

        case "abs":
          return Math.abs(argument);
      }
    }
  }
}
