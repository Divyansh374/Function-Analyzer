import type { Expression } from "./types";

export interface Polynomial {
  coefficients: number[];
}

function add(a: number[], b: number[]): number[] {
  const result = Array(Math.max(a.length, b.length)).fill(0);

  for (let i = 0; i < a.length; i++) {
    result[i] += a[i];
  }

  for (let i = 0; i < b.length; i++) {
    result[i] += b[i];
  }

  return result;
}

function multiply(a: number[], b: number[]): number[] {
  const result = Array(a.length + b.length - 1).fill(0);

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      result[i + j] += a[i] * b[j];
    }
  }

  return result;
}

function scale(a: number[], scalar: number): number[] {
  return a.map((coefficient) => coefficient * scalar);
}

function power(base: number[], exponent: number): number[] {
  let result = [1];

  for (let i = 0; i < exponent; i++) {
    result = multiply(result, base);
  }

  return result;
}

export function toPolynomial(expression: Expression): Polynomial | null {
  switch (expression.type) {
    case "number":
      return {
        coefficients: [expression.value],
      };

    case "variable":
      return {
        coefficients: [0, 1],
      };

    case "unary": {
      const operand = toPolynomial(expression.operand);

      if (!operand) return null;

      return {
        coefficients: scale(operand.coefficients, -1),
      };
    }

    case "binary": {
      const left = toPolynomial(expression.left);
      const right = toPolynomial(expression.right);

      if (expression.operator === "^") {
        if (!left || expression.right.type !== "number") {
          return null;
        }

        const exponent = expression.right.value;

        if (!Number.isInteger(exponent) || exponent < 0) {
          return null;
        }

        return {
          coefficients: power(left.coefficients, exponent),
        };
      }

      if (!left || !right) return null;

      switch (expression.operator) {
        case "+":
          return {
            coefficients: add(left.coefficients, right.coefficients),
          };

        case "-":
          return {
            coefficients: add(left.coefficients, scale(right.coefficients, -1)),
          };

        case "*":
          return {
            coefficients: multiply(left.coefficients, right.coefficients),
          };

        case "/":
          // A polynomial divided by another polynomial
          // isn't necessarily a polynomial.
          if (right.coefficients.length !== 1 || right.coefficients[0] === 0) {
            return null;
          }

          return {
            coefficients: scale(left.coefficients, 1 / right.coefficients[0]),
          };
      }
      break;
    }

    case "function":
      return null;
  }
}
