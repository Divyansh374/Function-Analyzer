import { evaluate } from "./evaluator";

import type { Expression } from "./types";

export interface GraphPoint {
  x: number;
  y: number | null;
}

const DISPLAY_Y_MIN = -10;
const DISPLAY_Y_MAX = 10;

const SLOPE_LIMIT = 150;

export function generateGraphPoints(
  expression: Expression,
  minX: number,
  maxX: number,
  step: number,
): GraphPoint[] {
  const points: GraphPoint[] = [];

  const count = Math.floor((maxX - minX) / step);

  let previousX: number | null = null;
  let previousY: number | null = null;

  for (let i = 0; i <= count; i++) {
    const x = minX + i * step;
    const y = evaluate(expression, x);

    let graphY: number | null = y;

    if (!Number.isFinite(y) || y < DISPLAY_Y_MIN || y > DISPLAY_Y_MAX) {
      graphY = null;
    }

    // Detect sudden jumps between neighbouring points
    if (previousX !== null && previousY !== null && graphY !== null) {
      const slope = Math.abs((graphY - previousY) / (x - previousX));

      if (slope > SLOPE_LIMIT) {
        points.push({
          x,
          y: null,
        });

        previousX = x;
        previousY = null;

        continue;
      }
    }

    points.push({
      x,
      y: graphY,
    });

    previousX = x;
    previousY = graphY;
  }

  return points;
}
