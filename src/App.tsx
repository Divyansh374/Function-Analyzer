import { useState } from "react";
import "./App.css";

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

  function analyze(expression = inputExpression) {
    try {
      const parsed = parse(expression);

      setParsedExpression(parsed);
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
    <main className="app">
      <div className="background-glow" />

      <div className="app-shell">
        <header className="hero">
          <div className="hero-badge">Mathematical Analysis Tool</div>

          <h1>
            Function
            <span> Analyzer</span>
          </h1>

          <p>Visualize, analyze and understand mathematical functions.</p>
        </header>

        <section className="input-card">
          <FunctionInput
            value={inputExpression}
            setValue={setInputExpression}
            onChange={setInputExpression}
            onAnalyze={analyze}
            error={error}
          />
        </section>

        {parsedExpression && analysis && (
          <>
            <section className="graph-card">
              <div className="card-header">
                <div>
                  <p className="eyebrow">Visualization</p>
                  <h2>Function Graph</h2>
                </div>

                <div className="function-badge">f(x)</div>
              </div>

              <div className="graph-container">
                <FunctionGraph points={points} />
              </div>
            </section>

            <section className="results-grid">
              <div className="analysis-card">
                <AnalysisPanel analysis={analysis} />
              </div>

              {derivative && (
                <div className="analysis-card derivative-card">
                  <div className="card-header">
                    <div>
                      <p className="eyebrow">Calculus</p>

                      <h2>Derivative</h2>
                    </div>

                    <div className="derivative-symbol">f′</div>
                  </div>

                  <div className="derivative-box">
                    <span>f′(x) =</span>

                    <code>{stringify(derivative)}</code>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        <footer className="footer">
          <span>Function Analyzer</span>
          <span>•</span>
          <span>Built with React + TypeScript</span>
        </footer>
      </div>
    </main>
  );
}

export default App;
