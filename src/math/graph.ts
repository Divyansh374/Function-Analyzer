import { evaluate } from "./evaluator";
import type { Expression } from "./types";

export interface GraphPoint {
  x: number;
  y: number | null;
}

const GRAPH_LIMIT = 20;
const DISCONTINUITY_THRESHOLD = 5;

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

    // Values that are undefined or too large to display
    // are treated as a break in the graph.
    if (!Number.isFinite(y) || Math.abs(y) > GRAPH_LIMIT) {
      graphY = null;
    }

    // Detect a likely vertical discontinuity.
    //
    // A large sign change is usually an asymptote rather
    // than a root.
    if (
      previousY !== null &&
      graphY !== null &&
      previousY * graphY < 0 &&
      Math.abs(previousY) > DISCONTINUITY_THRESHOLD &&
      Math.abs(graphY) > DISCONTINUITY_THRESHOLD
    ) {
      points[points.length - 1] = {
        x: previousX!,
        y: null,
      };

      graphY = null;
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
