import type { Expression } from "./types";

function number(value: number): Expression {
  return {
    type: "number",
    value,
  };
}

export function simplify(expression: Expression): Expression {
  switch (expression.type) {
    case "number":
    case "variable":
      return expression;

    case "unary": {
      const operand = simplify(expression.operand);

      if (operand.type === "number") {
        return number(-operand.value);
      }

      return {
        type: "unary",
        operator: "-",
        operand,
      };
    }

    case "function":
      return {
        ...expression,
        argument: simplify(expression.argument),
      };

    case "binary": {
      const left = simplify(expression.left);
      const right = simplify(expression.right);

      // Constant folding
      if (left.type === "number" && right.type === "number") {
        switch (expression.operator) {
          case "+":
            return number(left.value + right.value);

          case "-":
            return number(left.value - right.value);

          case "*":
            return number(left.value * right.value);

          case "/":
            return number(left.value / right.value);

          case "^":
            return number(Math.pow(left.value, right.value));
        }
      }

      // x + 0 = x
      if (
        expression.operator === "+" &&
        right.type === "number" &&
        right.value === 0
      ) {
        return left;
      }

      // 0 + x = x
      if (
        expression.operator === "+" &&
        left.type === "number" &&
        left.value === 0
      ) {
        return right;
      }

      // x - 0 = x
      if (
        expression.operator === "-" &&
        right.type === "number" &&
        right.value === 0
      ) {
        return left;
      }

      // x * 1 = x
      if (
        expression.operator === "*" &&
        right.type === "number" &&
        right.value === 1
      ) {
        return left;
      }

      // 1 * x = x
      if (
        expression.operator === "*" &&
        left.type === "number" &&
        left.value === 1
      ) {
        return right;
      }

      // x * 0 = 0
      if (
        expression.operator === "*" &&
        ((left.type === "number" && left.value === 0) ||
          (right.type === "number" && right.value === 0))
      ) {
        return number(0);
      }

      // x / 1 = x
      if (
        expression.operator === "/" &&
        right.type === "number" &&
        right.value === 1
      ) {
        return left;
      }

      // x^1 = x
      if (
        expression.operator === "^" &&
        right.type === "number" &&
        right.value === 1
      ) {
        return left;
      }

      // x^0 = 1
      if (
        expression.operator === "^" &&
        right.type === "number" &&
        right.value === 0
      ) {
        return number(1);
      }

      return {
        type: "binary",
        operator: expression.operator,
        left,
        right,
      };
    }
  }
}
