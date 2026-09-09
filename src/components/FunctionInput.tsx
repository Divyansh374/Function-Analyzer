interface FunctionInputProps {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: (value: string) => void;
  onAnalyze: (expression?: string) => void;
  error: string | null;
}

export function FunctionInput({
  value,
  setValue,
  onChange,
  onAnalyze,
  error,
}: FunctionInputProps) {
  function selectRecommendation(expression: string) {
    setValue(expression);
    onAnalyze(expression);
  }

  return (
    <div className="function-input">
      <label htmlFor="function-input">Enter a function</label>

      <div className="input-col">
        <div className="input-row">
          <span className="function-prefix">f(x) = </span>

          <input
            id="function-input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onAnalyze();
              }
            }}
            placeholder="x^2 + 2*x + 1"
            spellCheck={false}
          />

          <button type="button" onClick={() => onAnalyze()}>
            Analyze
          </button>
        </div>
        <div className="recommendations">
          <button
            className="recommendation-btn"
            onClick={() => selectRecommendation("sin(x)")}
          >
            sin(x)
          </button>
          <button
            className="recommendation-btn"
            onClick={() => selectRecommendation("tan(x)")}
          >
            tan(x)
          </button>
          <button
            className="recommendation-btn"
            onClick={() => selectRecommendation("cos(x)")}
          >
            cos(x)
          </button>
          <button
            className="recommendation-btn"
            onClick={() => selectRecommendation("log(x)")}
          >
            log(x)
          </button>
        </div>
      </div>

      {error && <p className="input-error">{error}</p>}
    </div>
  );
}
