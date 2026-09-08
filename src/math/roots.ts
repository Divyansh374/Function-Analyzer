import { evaluate } from "./evaluator";
import type { Expression } from "./types";

const ROOT_TOLERANCE = 1e-7;
const MAX_ITERATIONS = 60;
const MAX_FUNCTION_VALUE = 1000;

function bisectRoot(
  expression: Expression,
  left: number,
  right: number,
): number | null {
  let leftValue = evaluate(expression, left);
  let rightValue = evaluate(expression, right);

  if (!Number.isFinite(leftValue) || !Number.isFinite(rightValue)) {
    return null;
  }

  if (Math.abs(leftValue) < ROOT_TOLERANCE) {
    return left;
  }

  if (Math.abs(rightValue) < ROOT_TOLERANCE) {
    return right;
  }

  // No sign change means no guaranteed root in this interval.
  if (leftValue * rightValue > 0) {
    return null;
  }

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const middle = (left + right) / 2;
    const middleValue = evaluate(expression, middle);

    if (Math.abs(middleValue) > MAX_FUNCTION_VALUE) {
      return null;
    }

    if (!Number.isFinite(middleValue)) {
      return null;
    }

    if (Math.abs(middleValue) < ROOT_TOLERANCE) {
      return middle;
    }

    if (leftValue * middleValue < 0) {
      right = middle;
      rightValue = middleValue;
    } else {
      left = middle;
      leftValue = middleValue;
    }
  }

  const root = (left + right) / 2;
  const rootValue = evaluate(expression, root);

  if (Number.isFinite(rootValue) && Math.abs(rootValue) < ROOT_TOLERANCE * 10) {
    return root;
  }

  return null;
}

export function findNumericalRoots(
  expression: Expression,
  minX: number,
  maxX: number,
  step: number,
): number[] {
  const roots: number[] = [];

  let previousX = minX;
  let previousY = evaluate(expression, previousX);

  for (let x = minX + step; x <= maxX; x += step) {
    const currentY = evaluate(expression, x);

    if (
      Number.isFinite(previousY) &&
      Number.isFinite(currentY) &&
      previousY * currentY < 0
    ) {
      const root = bisectRoot(expression, previousX, x);

      if (root !== null) {
        roots.push(root);
      }
    }

    previousX = x;
    previousY = currentY;
  }

  return roots.filter(
    (root, index) => index === 0 || Math.abs(root - roots[index - 1]) > 1e-5,
  );
}
