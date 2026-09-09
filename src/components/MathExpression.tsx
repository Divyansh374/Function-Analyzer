import type { ReactNode } from "react";
import type { Expression } from "../math/types";

interface MathExpressionProps {
  expression: Expression;
}

function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  // Handle common fractions produced by differentiation
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

  return Number(value.toFixed(4)).toString();
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
      return (
        <>
          {expression.name}({renderExpression(expression.argument)})
        </>
      );

    case "binary": {
      if (expression.operator === "^") {
        const base = expression.left;

        const needsParentheses =
          base.type === "binary" || base.type === "unary";

        return (
          <>
            {needsParentheses && "("}
            {renderExpression(base)}
            {needsParentheses && ")"}
            <sup>{renderExpression(expression.right)}</sup>
          </>
        );
      }

      if (expression.operator === "*") {
        return (
          <>
            {renderExpression(expression.left)}
            <span className="math-operator">·</span>
            {renderExpression(expression.right)}
          </>
        );
      }

      if (expression.operator === "/") {
        return (
          <span className="math-fraction">
            <span className="math-numerator">
              {renderExpression(expression.left)}
            </span>

            <span className="math-fraction-line" />

            <span className="math-denominator">
              {renderExpression(expression.right)}
            </span>
          </span>
        );
      }

      return (
        <>
          {renderExpression(expression.left)}
          <span className="math-operator">{expression.operator}</span>
          {renderExpression(expression.right)}
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
