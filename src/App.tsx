import { useState } from "react";

import { FunctionInput } from "./components/FunctionInput";
import { FunctionGraph } from "./components/FunctionGraph";
import { AnalysisPanel } from "./components/AnalysisPanel";

import { analyzeFunction } from "./math/analyzer";
import { generateGraphPoints } from "./math/graph";
import { parse } from "./math/parser";
import { differentiate } from "./math/differentiator";
import { simplify } from "./math/simplifier";
import { stringify } from "./math/stringify";

import type { Expression } from "./math/types";

function App() {
  const [inputExpression, setInputExpression] = useState("x^2 - 4*x + 3");

  const [parsedExpression, setParsedExpression] = useState<Expression | null>(
    () => parse("x^2 - 4*x + 3"),
  );

  const [error, setError] = useState<string | null>(null);

  function analyze() {
    try {
      const expression = parse(inputExpression);

      setParsedExpression(expression);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid expression");
    }
  }

  const points = parsedExpression
    ? generateGraphPoints(parsedExpression, -10, 10, 0.1)
    : [];

  const analysis = parsedExpression ? analyzeFunction(parsedExpression) : null;

  const derivative = parsedExpression
    ? simplify(differentiate(parsedExpression))
    : null;

  return (
    <main>
      <h1>Function Analyzer</h1>

      <FunctionInput
        value={inputExpression}
        onChange={setInputExpression}
        onAnalyze={analyze}
        error={error}
      />

      {parsedExpression && analysis && (
        <>
          <FunctionGraph points={points} />

          <AnalysisPanel analysis={analysis} />
        </>
      )}
      {derivative && (
        <section>
          <h2>Derivative</h2>
          <p>f'(x) = {stringify(derivative)}</p>
        </section>
      )}
    </main>
  );
}

export default App;
