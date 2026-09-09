import type { ReactNode } from "react";
import type { Expression } from "../math/types";

interface MathExpressionProps {
  expression: Expression;
}

function getConstantValue(expression: Expression): number | null {
  switch (expression.type) {
    case "number":
      return expression.value;

    case "unary": {
      const value = getConstantValue(expression.operand);
      return value === null ? null : -value;
    }

    case "binary": {
      const left = getConstantValue(expression.left);
      const right = getConstantValue(expression.right);

      if (left === null || right === null) {
        return null;
      }

      switch (expression.operator) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return right === 0 ? null : left / right;
        case "^":
          return Math.pow(left, right);
      }
      break;
    }

    case "variable":
    case "function":
      return null;
  }
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  const rounded = Number(value.toFixed(6));

  const fractions: [number, number, number][] = [
    [1 / 2, 1, 2],
    [1 / 3, 1, 3],
    [2 / 3, 2, 3],
    [1 / 4, 1, 4],
    [3 / 4, 3, 4],
    [1 / 5, 1, 5],
    [2 / 5, 2, 5],
    [3 / 5, 3, 5],
    [4 / 5, 4, 5],
  ];

  for (const [decimal, numerator, denominator] of fractions) {
    if (Math.abs(value - decimal) < 1e-10) {
      return `${numerator}/${denominator}`;
    }

    if (Math.abs(value + decimal) < 1e-10) {
      return `-${numerator}/${denominator}`;
    }
  }

  return String(rounded);
}

function isNumber(expression: Expression): expression is {
  type: "number";
  value: number;
} {
  return expression.type === "number";
}

function renderExpression(expression: Expression): ReactNode {
  switch (expression.type) {
    case "number":
      return formatNumber(expression.value);

    case "variable":
      return <i>x</i>;

    case "unary":
      return <>−{renderExpression(expression.operand)}</>;

    case "function":
      if (expression.name === "sqrt") {
        return <>√({renderExpression(expression.argument)})</>;
      }
      return (
        <>
          {expression.name}({renderExpression(expression.argument)})
        </>
      );

    case "binary": {
      const { operator, left, right } = expression;

      // Powers
      if (operator === "^") {
        const needsParentheses =
          left.type === "binary" || left.type === "unary";

        const exponent = getConstantValue(right);

        return (
          <>
            {needsParentheses && "("}
            {renderExpression(left)}
            {needsParentheses && ")"}

            <sup>
              {exponent !== null
                ? formatNumber(exponent)
                : renderExpression(right)}
            </sup>
          </>
        );
      }

      // Multiplication
      if (operator === "*") {
        // 2 * x → 2x
        if (isNumber(left) && right.type === "variable") {
          return (
            <>
              {renderExpression(left)}
              {renderExpression(right)}
            </>
          );
        }

        // x * 2 → 2x
        if (left.type === "variable" && isNumber(right)) {
          return (
            <>
              {renderExpression(right)}
              {renderExpression(left)}
            </>
          );
        }

        return (
          <>
            {renderExpression(left)}
            <span className="math-operator">·</span>
            {renderExpression(right)}
          </>
        );
      }

      // Division
      if (operator === "/") {
        return (
          <span className="math-fraction">
            <span className="math-numerator">{renderExpression(left)}</span>

            <span className="math-fraction-line" />

            <span className="math-denominator">{renderExpression(right)}</span>
          </span>
        );
      }

      // Addition / subtraction
      return (
        <>
          {renderExpression(left)}

          <span className="math-operator">
            {operator === "-" ? "−" : operator}
          </span>

          {renderExpression(right)}
        </>
      );
    }
  }
}

export function MathExpression({ expression }: MathExpressionProps) {
  return (
    <span className="math-expression">{renderExpression(expression)}</span>
  );
}
