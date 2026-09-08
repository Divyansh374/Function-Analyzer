import type { Expression } from "./types";

function precedence(expression: Expression): number {
  switch (expression.type) {
    case "number":
    case "variable":
    case "function":
      return 5;

    case "unary":
      return 4;

    case "binary":
      switch (expression.operator) {
        case "+":
        case "-":
          return 1;

        case "*":
        case "/":
          return 2;

        case "^":
          return 3;
      }
  }
}

export function stringify(
  expression: Expression,
  parentPrecedence = 0,
): string {
  let result: string;
  const currentPrecedence = precedence(expression);

  switch (expression.type) {
    case "number":
      result = Number.isInteger(expression.value)
        ? String(expression.value)
        : String(expression.value);

      break;

    case "variable":
      result = "x";
      break;

    case "unary":
      result = `-${stringify(expression.operand, currentPrecedence)}`;
      break;

    case "function":
      result = `${expression.name}(${stringify(expression.argument)})`;
      break;

    case "binary": {
      const left = stringify(expression.left, currentPrecedence);
      const right = stringify(
        expression.right,
        expression.operator === "^" ? currentPrecedence : currentPrecedence + 1,
      );

      result = `${left} ${expression.operator} ${right}`;
      break;
    }
  }

  if (currentPrecedence < parentPrecedence) {
    return `(${result})`;
  }

  return result;
}
