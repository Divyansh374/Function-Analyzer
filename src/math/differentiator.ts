import type { Expression } from "./types";

export function differentiate(expression: Expression): Expression {
  switch (expression.type) {
    case "number":
      return {
        type: "number",
        value: 0,
      };

    case "variable":
      return {
        type: "number",
        value: 1,
      };

    case "unary":
      return {
        type: "unary",
        operator: "-",
        operand: differentiate(expression.operand),
      };

    case "binary": {
      const { left, right, operator } = expression;

      const leftDerivative = differentiate(left);
      const rightDerivative = differentiate(right);

      switch (operator) {
        case "+":
          return {
            type: "binary",
            operator: "+",
            left: leftDerivative,
            right: rightDerivative,
          };

        case "-":
          return {
            type: "binary",
            operator: "-",
            left: leftDerivative,
            right: rightDerivative,
          };

        case "*":
          // (fg)' = f'g + fg'
          return {
            type: "binary",
            operator: "+",
            left: {
              type: "binary",
              operator: "*",
              left: leftDerivative,
              right,
            },
            right: {
              type: "binary",
              operator: "*",
              left,
              right: rightDerivative,
            },
          };

        case "/":
          // (f/g)' = (f'g - fg') / g²
          return {
            type: "binary",
            operator: "/",
            left: {
              type: "binary",
              operator: "-",
              left: {
                type: "binary",
                operator: "*",
                left: leftDerivative,
                right,
              },
              right: {
                type: "binary",
                operator: "*",
                left,
                right: rightDerivative,
              },
            },
            right: {
              type: "binary",
              operator: "^",
              left: right,
              right: {
                type: "number",
                value: 2,
              },
            },
          };

        case "^": {
          // For now we support f(x)^n,
          // where n is a constant.
          if (right.type !== "number") {
            throw new Error(
              "Differentiation of variable exponents is not supported yet",
            );
          }

          const n = right.value;

          return {
            type: "binary",
            operator: "*",
            left: {
              type: "number",
              value: n,
            },
            right: {
              type: "binary",
              operator: "*",
              left: {
                type: "binary",
                operator: "^",
                left,
                right: {
                  type: "number",
                  value: n - 1,
                },
              },
              right: leftDerivative,
            },
          };
        }
      }
      break;
    }

    case "function": {
      const argument = expression.argument;
      const argumentDerivative = differentiate(argument);

      switch (expression.name) {
        case "sin":
          // (sin f)' = cos(f) * f'
          return {
            type: "binary",
            operator: "*",
            left: {
              type: "function",
              name: "cos",
              argument,
            },
            right: argumentDerivative,
          };

        case "cos":
          // (cos f)' = -sin(f) * f'
          return {
            type: "binary",
            operator: "*",
            left: {
              type: "unary",
              operator: "-",
              operand: {
                type: "function",
                name: "sin",
                argument,
              },
            },
            right: argumentDerivative,
          };

        case "tan":
          // (tan f)' = (1 / cos²(f)) * f'
          return {
            type: "binary",
            operator: "*",
            left: {
              type: "binary",
              operator: "/",
              left: {
                type: "number",
                value: 1,
              },
              right: {
                type: "binary",
                operator: "^",
                left: {
                  type: "function",
                  name: "cos",
                  argument,
                },
                right: {
                  type: "number",
                  value: 2,
                },
              },
            },
            right: argumentDerivative,
          };

        case "sqrt":
          // (sqrt(f))' = f' / (2sqrt(f))
          return {
            type: "binary",
            operator: "/",
            left: argumentDerivative,
            right: {
              type: "binary",
              operator: "*",
              left: {
                type: "number",
                value: 2,
              },
              right: {
                type: "function",
                name: "sqrt",
                argument,
              },
            },
          };

        case "log":
          // (log(f))' = f' / f
          return {
            type: "binary",
            operator: "/",
            left: argumentDerivative,
            right: argument,
          };

        case "abs":
          throw new Error("Differentiation of abs(x) is not supported yet");
      }
    }
  }
}
