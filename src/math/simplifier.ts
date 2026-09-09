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
            return { type: "number", value: left.value + right.value };

          case "-":
            return { type: "number", value: left.value - right.value };

          case "*":
            return { type: "number", value: left.value * right.value };

          case "/":
            if (right.value !== 0) {
              return {
                type: "number",
                value: left.value / right.value,
              };
            }
            break;

          case "^":
            return {
              type: "number",
              value: Math.pow(left.value, right.value),
            };
        }
      }

      switch (expression.operator) {
        case "+": {
          // x + 0 = x
          if (right.type === "number" && right.value === 0) {
            return left;
          }

          // 0 + x = x
          if (left.type === "number" && left.value === 0) {
            return right;
          }

          return {
            type: "binary",
            operator: "+",
            left,
            right,
          };
        }

        case "-": {
          // x - 0 = x
          if (right.type === "number" && right.value === 0) {
            return left;
          }

          // 0 - x = -x
          if (left.type === "number" && left.value === 0) {
            return {
              type: "unary",
              operator: "-",
              operand: right,
            };
          }

          return {
            type: "binary",
            operator: "-",
            left,
            right,
          };
        }

        case "*": {
          // 0 * x = 0
          if (
            (left.type === "number" && left.value === 0) ||
            (right.type === "number" && right.value === 0)
          ) {
            return { type: "number", value: 0 };
          }

          // 1 * x = x
          if (left.type === "number" && left.value === 1) {
            return right;
          }

          // x * 1 = x
          if (right.type === "number" && right.value === 1) {
            return left;
          }

          return {
            type: "binary",
            operator: "*",
            left,
            right,
          };
        }

        case "/": {
          // x / 1 = x
          if (right.type === "number" && right.value === 1) {
            return left;
          }

          return {
            type: "binary",
            operator: "/",
            left,
            right,
          };
        }

        case "^": {
          // x^0 = 1
          if (right.type === "number" && right.value === 0) {
            return { type: "number", value: 1 };
          }

          // x^1 = x
          if (right.type === "number" && right.value === 1) {
            return left;
          }

          // (x^a)^b = x^(a*b)
          if (
            left.type === "binary" &&
            left.operator === "^" &&
            left.right.type === "number" &&
            right.type === "number" &&
            Number.isInteger(left.right.value) &&
            Number.isInteger(right.value)
          ) {
            return {
              type: "binary",
              operator: "^",
              left: left.left,
              right: {
                type: "number",
                value: left.right.value * right.value,
              },
            };
          }

          return {
            type: "binary",
            operator: "^",
            left,
            right,
          };
        }
      }
    }
  }
}
