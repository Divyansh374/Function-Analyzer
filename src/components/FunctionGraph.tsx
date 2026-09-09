import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { GraphPoint } from "../math/graph";

interface FunctionGraphProps {
  points: GraphPoint[];
}

export function FunctionGraph({ points }: FunctionGraphProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={points}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="x" type="number" />

        <YAxis domain={[-10, 10]} allowDataOverflow={false} />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="y"
          dot={false}
          isAnimationActive={false}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
