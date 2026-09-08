import { evaluate } from "./evaluator";
import { toPolynomial } from "./polynomial";
import { findNumericalRoots } from "./roots";

import type { Expression } from "./types";

export interface FunctionAnalysis {
  isPolynomial: boolean;

  degree: number | null;

  yIntercept: number | null;

  roots: number[];

  vertex: {
    x: number;
    y: number;
  } | null;
}

function trimCoefficients(coefficients: number[]): number[] {
  const result = [...coefficients];

  while (result.length > 1 && Math.abs(result[result.length - 1]) < 1e-10) {
    result.pop();
  }

  return result;
}

function findRoots(coefficients: number[]): number[] {
  const c = trimCoefficients(coefficients);
  const degree = c.length - 1;

  if (degree === 0) {
    return [];
  }

  // ax + b = 0
  if (degree === 1) {
    const [b, a] = c;

    return [-b / a];
  }

  // ax^2 + bx + c = 0
  if (degree === 2) {
    const [constant, linear, quadratic] = c;

    const discriminant = linear * linear - 4 * quadratic * constant;

    if (discriminant < 0) {
      return [];
    }

    if (Math.abs(discriminant) < 1e-10) {
      return [-linear / (2 * quadratic)];
    }

    const sqrtDiscriminant = Math.sqrt(discriminant);

    return [
      (-linear - sqrtDiscriminant) / (2 * quadratic),
      (-linear + sqrtDiscriminant) / (2 * quadratic),
    ].sort((a, b) => a - b);
  }

  return [];
}

export function analyzeFunction(expression: Expression): FunctionAnalysis {
  const polynomial = toPolynomial(expression);

  if (!polynomial) {
    return {
      isPolynomial: false,
      degree: null,
      yIntercept: getYIntercept(expression),
      roots: findNumericalRoots(expression, -10, 10, 0.01),
      vertex: null,
    };
  }

  const coefficients = trimCoefficients(polynomial.coefficients);
  const degree = coefficients.length - 1;
  const roots = findRoots(coefficients);

  let vertex = null;

  if (degree === 2) {
    const [constant, linear, quadratic] = coefficients;

    const x = -linear / (2 * quadratic);

    vertex = {
      x,
      y: quadratic * x * x + linear * x + constant,
    };
  }

  return {
    isPolynomial: true,
    degree,
    yIntercept: coefficients[0],
    roots,
    vertex,
  };
}

function getYIntercept(expression: Expression): number | null {
  const value = evaluate(expression, 0);

  return Number.isFinite(value) ? value : null;
}
