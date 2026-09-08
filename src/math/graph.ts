import { evaluate } from "./evaluator";
import type { Expression } from "./types";

export interface GraphPoint {
  x: number;
  y: number;
}

export function generateGraphPoints(
  expression: Expression,
  minX: number,
  maxX: number,
  step: number,
): GraphPoint[] {
  const points: GraphPoint[] = [];
  const count = Math.floor((maxX - minX) / step);

  for (let i = 0; i <= count; i++) {
    const x = minX + i * step;
    const y = evaluate(expression, x);

    if (Number.isFinite(y)) {
      points.push({
        x,
        y,
      });
    }
  }

  return points;
}
