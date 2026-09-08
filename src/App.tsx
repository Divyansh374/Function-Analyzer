import { useState } from "react";

import { FunctionInput } from "./components/FunctionInput";
import { FunctionGraph } from "./components/FunctionGraph";
import { generateGraphPoints } from "./math/graph";
import { parse } from "./math/parser";
import type { Expression } from "./math/types";

function App() {
  const [inputExpression, setInputExpression] = useState("x^2");
  const [parsedExpression, setParsedExpression] = useState<Expression | null>(
    () => parse("x^2"),
  );
  const [error, setError] = useState<string | null>(null);

  function analyzeFunction() {
    try {
      const expression = parse(inputExpression);

      setParsedExpression(expression);
      setError(null);
    } catch (error) {
      setParsedExpression(null);

      setError(error instanceof Error ? error.message : "Invalid expression");
    }
  }

  const points = parsedExpression
    ? generateGraphPoints(parsedExpression, -10, 10, 0.1)
    : [];

  return (
    <main>
      <h1>Function Analyzer</h1>

      <FunctionInput
        value={inputExpression}
        onChange={setInputExpression}
        onAnalyze={analyzeFunction}
        error={error}
      />

      {parsedExpression && <FunctionGraph points={points} />}
    </main>
  );
}

export default App;
