import type { FunctionAnalysis } from "../math/analyzer";

interface AnalysisPanelProps {
  analysis: FunctionAnalysis;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(4);
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  return (
    <section>
      <h2>Function Analysis</h2>

      {analysis.isPolynomial ? (
        <p>
          Degree: <strong>{analysis.degree}</strong>
        </p>
      ) : (
        <p>Non-polynomial function</p>
      )}

      <p>
        Y-intercept:{" "}
        {analysis.yIntercept !== null
          ? `(${0}, ${formatNumber(analysis.yIntercept)})`
          : "Undefined"}
      </p>

      <div>
        <h3>Roots</h3>

        {analysis.roots.length > 0 ? (
          <ul>
            {analysis.roots.map((root) => (
              <li key={root}>x = {formatNumber(root)}</li>
            ))}
          </ul>
        ) : (
          <p>No real roots found.</p>
        )}
      </div>

      {analysis.vertex && (
        <div>
          <h3>Vertex</h3>

          <p>
            ({formatNumber(analysis.vertex.x)},{" "}
            {formatNumber(analysis.vertex.y)})
          </p>
        </div>
      )}
    </section>
  );
}
